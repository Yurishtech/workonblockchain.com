const users = require('../../../../model/mongoose/users');
const messages = require('../../../../model/messages');
const logger = require('../../../services/logger');
const currency = require('../../../services/currency');
const errors = require('../../../services/errors');
const cities = require('../../../../model/mongoose/cities');
const objects = require('../../../services/objects');


const salaryFactor = 1.1;

module.exports.candidateSearch = async function (filters, search, orderPreferences) {
    logger.debug("Doing new candidate search", {
        filters: filters,
        search: search
    });

    let userQuery = [];
    userQuery.push({"type" : 'candidate'});

    if (filters.is_verify === 1 || filters.is_verify === 0) userQuery.push({"is_verify" : filters.is_verify});

    if (filters.status && filters.status !== -1) userQuery.push({'candidate.latest_status.status' : filters.status}); //not sure about this
    if (filters.updatedAfter) userQuery.push({'candidate.history.0.timestamp' : {$gte: filters.updatedAfter}});

    if (filters.disable_account === true || filters.disable_account === false) userQuery.push({"disable_account" :  filters.disable_account});
    if (filters.msg_tags) {
        let userIds = [];
        const messageDocs = await messages.find({msg_tag : {$in: filters.msg_tags}}, {sender_id: 1, receiver_id: 1}).lean();
        if (!messageDocs) {
            errors.throwError("No users matched the search", 404);
        }
        for (messageDoc of messageDocs) {
            userIds.push(messageDoc.sender_id.toString());
            userIds.push(messageDoc.receiver_id.toString());
        }
        const userIdsDistinct = makeDistinctSet(userIds);
        userQuery.push({_id : {$in : userIdsDistinct}});

    }

    if (filters.blacklist) {
        userQuery.push({_id: {$nin: filters.blacklist}});
    }

    if (filters.firstApprovedDate) {
        const approvedDateFilter = {"first_approved_date" : { $gte : filters.firstApprovedDate}};
        userQuery.push(approvedDateFilter);
    }

    if (search) {
        if(search.name) {
            const nameSearch = { $or: [{ first_name: {'$regex' : search.name, $options: 'i'}},
                {last_name : {'$regex' : search.name, $options: 'i'}}] };
            userQuery.push(nameSearch);
        }
        if(search.word) {
            const wordSearch = { $or: [{ 'candidate.why_work': {'$regex' : search.word, $options: 'i'}},
                {description : {'$regex' : search.word, $options: 'i'}}] };
            userQuery.push(wordSearch);
        }
        if (search.locations && search.locations.length > 0 ) {
            let locationsQuery = [];
            let citiesArray=[];
            let countriesArray = [];
            for(let loc of search.locations) {
                const cityDoc = await cities.findOneById(loc.city);
                if(cityDoc) {
                    citiesArray.push(cityDoc._id);
                    countriesArray.push(cityDoc.country);
                }
            }
            if(citiesArray.length > 0 ) {
                countriesArray = removeDups(countriesArray);
                if (search.visa_needed) {
                    for (let city of citiesArray) {
                        const cityQuery = {
                            "candidate.locations": {
                                $elemMatch: {
                                    city: city,
                                    visa_needed: true
                                }
                            }
                        }
                        locationsQuery.push(cityQuery)
                    }

                    for (let country of countriesArray) {
                        const countryQuery = {
                            "candidate.locations": {
                                $elemMatch: {
                                    country: country,
                                    visa_needed: true
                                }
                            }
                        }
                        locationsQuery.push(countryQuery)
                    }
                }
                else {
                    for (let city of citiesArray) {
                        const cityQuery = {
                            "candidate.locations": {
                                $elemMatch: {
                                    city: city,
                                    visa_needed: false
                                }
                            }
                        }
                        locationsQuery.push(cityQuery)
                    }

                    for (let country of countriesArray) {
                        const countryQuery = {
                            "candidate.locations": {
                                $elemMatch: {
                                    country: country,
                                    visa_needed: false
                                }
                            }
                        }
                        locationsQuery.push(countryQuery)
                    }

                }

            }
            if(search.locations.find(x => x.remote === true)) {
                const locationRemoteFilter = {"candidate.locations.remote" : true};
                locationsQuery.push(locationRemoteFilter);
            }
            if(locationsQuery && locationsQuery.length > 0) {
                userQuery.push({
                    $or:locationsQuery
                });
            }

        }

        if (search.positions && search.positions.length > 0  ) {
            const rolesFilter = {"candidate.roles": {$in: search.positions}};
            userQuery.push(rolesFilter);
        }
        if (search.blockchains && search.blockchains.length > 0 ) {
            const platformFilter = {
                $or: [
                    {"candidate.blockchain.commercial_platforms.name": {$in: search.blockchains}},
                    {"candidate.blockchain.smart_contract_platforms.name": {$in: search.blockchains}}
                ]
            };
            userQuery.push(platformFilter);
        }

        if (search.salary && search.salary.current_currency && search.salary.current_salary) {
            const curr = search.salary.current_currency;
            const salary = search.salary.current_salary;
            const usd = [{'candidate.expected_salary_currency': "$ USD"}, {'candidate.expected_salary': {$lte: salaryFactor*currency.convert(curr, "$ USD", salary)}}];
            const gbp = [{'candidate.expected_salary_currency': "£ GBP"}, {'candidate.expected_salary': {$lte: salaryFactor*currency.convert(curr, "£ GBP", salary)}}];
            const eur = [{'candidate.expected_salary_currency': "€ EUR"}, {'candidate.expected_salary': {$lte: salaryFactor*currency.convert(curr, "€ EUR", salary)}}];
            const currencyFiler = {
                $or : [{ $and : usd }, { $and : gbp }, { $and : eur }]
            };
            userQuery.push(currencyFiler);
        }

        if (search.skills && search.skills.length > 0) {
            const skillsFilter = {"candidate.programming_languages.language": {$in: search.skills}};
            userQuery.push(skillsFilter);
        }

        if (search.residence_country && search.residence_country.length > 0) {
            const residenceCountryFilter = {"candidate.base_country": {$in: search.residence_country}};
            userQuery.push(residenceCountryFilter);
        }

    }

    let orderBy;

    if(orderPreferences) {
        if (orderPreferences.blockchainOrder && orderPreferences.blockchainOrder.length > 0 ) {
            orderBy = {
                $or: [
                    {"candidate.blockchain.commercial_platforms.name": {$in: orderPreferences.blockchainOrder}},
                    {"candidate.blockchain.smart_contract_platforms.name": {$in: orderPreferences.blockchainOrder}}
                ]
            };
        }
    }

    console.log("user query");
    console.log(userQuery);
    let searchQuery = {$and: userQuery};
    const userDocs = await users.find(searchQuery);
    if(userDocs && userDocs.length > 0) {
        if(orderBy) {
            userQuery.push(orderBy);
            searchQuery = {$and: userQuery};
            const userDocsOrderBy = await users.find(searchQuery);
            let sortedDocs = userDocsOrderBy.concat(userDocs);
            sortedDocs = objects.removeDuplicates(sortedDocs , '_id');
            return {
                count: sortedDocs.length,
                candidates: sortedDocs
            };
        }
        else {
            return {
                count: userDocs.length,
                candidates: userDocs
            };
        }

    }
    else {
        errors.throwError("No candidates matched this search criteria", 404);
    }

}

function makeDistinctSet(array) {
    return Array.from(new Set(array));
}

function salary_converter(salary_value, currency1, currency2)
{

    let value1 = (salary_value / currency1).toFixed();
    let value2 = (salary_value/currency2).toFixed();
    let array = [];

    array.push(value1);
    array.push(value2);

    return array;
}

//Remove duplicates from one dimension array
function removeDups(names) {
    let unique = {};
    names.forEach(function(i) {
        if(!unique[i]) {
            unique[i] = true;
        }
    });
    return Object.keys(unique);
}
