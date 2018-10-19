const settings = require('../../../../settings');
var _ = require('lodash');
var Q = require('q');
const users = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const EmployerProfile = require('../../../../model/employer_profile');
const verifyEmailEmail = require('../../../services/email/emails/verifyEmail');
const logger = require('../../../services/logger');

module.exports = function verify_send_email(info) {
    var deferred = Q.defer()
    ////console.log(info.email);
    var name;
    users.findOne({ email :info.email  }, function (err, userDoc)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        if(userDoc)
        {
            if(userDoc.type== 'candidate')
            {

                CandidateProfile.find({_creator : userDoc._id}).populate('_creator').exec(function(err, query_data)
                {

                    if (err){
                        logger.error(err.message, {stack: err.stack});
                        deferred.reject(err.name + ': ' + err.message);
                    }
                    if(query_data)
                    {

                        if(query_data[0] && query_data[0].first_name)
                        {
                            name = query_data[0].first_name;
                        }
                        else
                        {
                            name = null;
                        }
                        verifyEmailEmail.sendEmail(info, userDoc.disable_account , name);

                    }
                    else
                    {
                        name = null;
                        verifyEmailEmail.sendEmail(info, userDoc.disable_account , name);
                    }

                });
            }
            else
            {

                EmployerProfile.find({_creator : userDoc._id}).populate('_creator').exec(function(err, query_data)
                {

                    if (err){
                        logger.error(err.message, {stack: err.stack});
                        deferred.reject(err.name + ': ' + err.message);
                    }
                    if(query_data)
                    {

                        if(query_data[0] && query_data[0].first_name)
                        {
                            name = query_data[0].first_name;
                        }
                        else
                        {
                            name = null;

                        }
                        verifyEmailEmail.sendEmail(info,userDoc.disable_account, name);

                    }
                    else
                    {
                        name = null;
                        verifyEmailEmail.sendEmail(info,userDoc.disable_account, name);
                    }

                });
            }

        }
        else
        {
            deferred.resolve({error:'Email Not Found'});
        }

    });


}