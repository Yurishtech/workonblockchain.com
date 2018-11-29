const CandidateProfile = require('../../../../model/candidate_profile');
const User = require('../../../../model/users');

const settings = require('../../../../settings');

const USD = settings.CURRENCY_RATES.USD;
const GBP = settings.CURRENCY_RATES.GBP;
const Euro = settings.CURRENCY_RATES.Euro;
const convertToDays = module.exports.convertToDays = function convertToDays(when_receive_email_notitfications) {
    switch(when_receive_email_notitfications) {
        case "Weekly":
            return 7;
            break;
        case "3 days":
            return 3;
            break;
        case "Daily":
            return 1;
            break;
        default :
            return 0;
            break;
    }
};

const candidateSearchQuery = module.exports.candidateSearchQuery = async function candidateSearchQuery(queryBody ) {
    let queryString = [];
    console.log(queryBody);
    const userDoc = await User.find({type : 'candidate' , is_verify :1,'candidate.status.0.status': 'approved' ,disable_account : false }).lean();
    if(userDoc) {
        console.log("userDoc");
        let userDocArray = [];

        for (userDetail of userDoc) {
            userDocArray.push(userDetail._id);
        }
        console.log(userDocArray);

        if(userDocArray && userDocArray.length > 0) {
            const usersToSearch = { "_creator": {$in: userDocArray}};
            queryString.push(usersToSearch);
        }
        if (queryBody[0].location) {
            const locationFilter = {"locations": {$in: queryBody[0].location}};
            queryString.push(locationFilter);
        }
        if (queryBody[0].position) {
            const rolesFilter = {"roles": {$in: queryBody[0].position}};
            queryString.push(rolesFilter);
        }
        if (queryBody[0].current_currency && queryBody[0].current_salary) {
            let salaryArray = [];
            let salaryConverterResult;
            if(queryBody[0].current_currency === '$ USD' && queryBody[0].current_salary)
            {
                salaryConverterResult = salary_converter(queryBody[0].current_salary, USD.GBP , USD.Euro );
                salaryArray= {USD : queryBody[0].current_salary , GBP : salaryConverterResult[0] , Euro :salaryConverterResult[1]};
            }

            if(queryBody[0].current_currency === '£ GBP' && queryBody[0].current_salary)
            {
                salaryConverterResult = salary_converter(queryBody[0].current_salary, GBP.USD , GBP.Euro );
                salaryArray= {USD : salaryConverterResult[0] , GBP : queryBody[0].current_salary , Euro :salaryConverterResult[1]};
            }
            if(queryBody[0].current_currency === '€ EUR' && queryBody[0].current_salary)
            {
                salaryConverterResult = salary_converter(queryBody[0].current_salary, Euro.USD , Euro.GBP );
                salaryArray= {USD : salaryConverterResult[0] , GBP : salaryConverterResult[1]  , Euro : queryBody[0].current_salary};
            }

            if(salaryArray.length > 0 && queryBody[0].current_currency && queryBody[0].current_salary) {
                const searchFilter = {
                    $or : [
                        { $and : [ { current_currency : "$ USD" }, { current_salary : {$lte: salaryArray.USD} } ] },
                        { $and : [ { current_currency : "£ GBP" }, { current_salary : {$lte: salaryArray.GBP} } ] },
                        { $and : [ { current_currency : "€ EUR" }, { current_salary : {$lte: salaryArray.Euro} } ] }
                    ]
                };
                queryString.push(searchFilter);
            }
        }

        if (queryBody[0].blockchain && queryBody[0].blockchain.length > 0) {
            const platformFilter = {
                $or: [
                    {"commercial_platform.platform_name": {$in: queryBody[0].blockchain}},
                    {"platforms.platform_name": {$in: queryBody[0].blockchain}}
                ]
            };
            queryString.push(platformFilter);
        }

        if (queryBody[0].skills && queryBody[0].skills.length > 0) {
            const skillsFilter = {"programming_languages.language": queryBody[0].skills};
            queryString.push(skillsFilter);
        }
        if (queryBody[0].availability_day) {
            const availabilityFilter = {"availability_day": queryBody[0].availability_day};
            queryString.push(availabilityFilter);
        }
        const searchQuery = {$and: queryString};
        if (queryString && queryString.length > 0) {
            const candidateDoc = await CandidateProfile.find(searchQuery).populate('_creator');
            return candidateDoc;
        }
        else {
            return null;
        }
    }

    else {
        return null;
    }

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
