const EmployerProfile = require('../../../../../model/mongoose/company');
const errors = require('../../../../services/errors');

module.exports = async  function (req,res)
{
    let userId = req.auth.user._id;
    const employerDoc = await EmployerProfile.findOne({ _creator: userId });

    if(employerDoc){
        const queryBody = req.body;
        let employerUpdate = {};

        if (queryBody.company_founded) employerUpdate.company_founded = queryBody.company_founded;
        if (queryBody.no_of_employees) employerUpdate.no_of_employees = queryBody.no_of_employees;
        if (queryBody.company_funded) employerUpdate.company_funded = queryBody.company_funded;
        if (queryBody.company_description) employerUpdate.company_description = queryBody.company_description;

        await EmployerProfile.update({ _creator: userId },{ $set: employerUpdate });

        res.send({
            success : true
        })
    }

    else {
        errors.throwError("Company account not found", 404);
    }

}