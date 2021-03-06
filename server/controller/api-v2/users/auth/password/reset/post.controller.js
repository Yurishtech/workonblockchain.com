const users = require('../../../../../../model/mongoose/users');
const jwtToken = require('../../../../../services/jwtToken');
const errors = require('../../../../../services/errors');
const forgotPasswordEmail = require('../../../../../services/email/emails/forgotPassword');
const companies = require('../../../../../../model/mongoose/companies');
const Schema = require('mongoose').Schema;
const regexes = require('../../../../../../model/regexes');

module.exports.request = {
    type: 'post',
    path: '/users/auth/password/reset'
};

const bodySchema = new Schema({
    email: String
});

module.exports.inputValidation = {
    body: bodySchema
}

module.exports.endpoint = async function (req, res) {
    let queryBody = req.body;
    let name;

    const userDoc  = await users.findOneByEmail( queryBody.email );
    if(userDoc) {
        let signOptions = {
            expiresIn:  "1h",
        };
        let forgotPasswordToken = jwtToken.createJwtToken(userDoc , signOptions);
        await users.update({ _id: userDoc._id },{ $set: {'forgot_password_key': forgotPasswordToken } });
        if(userDoc.type === 'candidate') {
            if(userDoc && userDoc.first_name) {
                name = userDoc.first_name;
            }
        }
        if(userDoc.type === 'company') {
            const companyDoc = await companies.findOne({_creator : userDoc._id});
            if(companyDoc ) {
                name = companyDoc.first_name;
            }
        }
        forgotPasswordEmail.sendEmail(userDoc.email, name, forgotPasswordToken);
        res.send({
            success : true
        })
    }
    else {
        errors.throwError("User not found", 404);
    }
}