const settings = require('../../../../settings');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var date = require('date-and-time');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const Pages = require('../../../../model/pages_content');
var crypto = require('crypto');
var jwt_hash = require('jwt-simple');
const EmployerProfile = require('../../../../model/employer_profile');
var md5 = require('md5');
const chat = require('../../../../model/chat');
const verify_send_email = require('../auth/verify_send_email');

const forgotPasswordEmail = require('../../../services/email/emails/forgotPassword');
const verifyEmailEmail = require('../../../services/email/emails/verifyEmail');
const referUserEmail = require('../../../services/email/emails/referUser');
const chatReminderEmail = require('../../../services/email/emails/chatReminder');
const referedUserEmail = require('../../../services/email/emails/referredFriend');

const USD = settings.CURRENCY_RATES.USD;
const GBP = settings.CURRENCY_RATES.GBP;
const Euro = settings.CURRENCY_RATES.Euro;
const emails = settings.COMPANY_EMAIL_BLACKLIST;
const logger = require('../../../services/logger');

module.exports = function (req,res)
{

    create_employer(req.body).then(function (err, data)
    {
        if (data)
        {
            res.json(data);
        }
        else
        {
            res.send(err);
        }
    })
        .catch(function (err)
        {
            res.json({error: err});
        });

};

function create_employer(userParam)
{
    var deferred = Q.defer();
    var count=0;
    var createdDate;

    var str = userParam.email;
    var email_split = str.split('@');

    for (var i = 0; i < emails.length; i++)
    {
        if(emails[i] == email_split[1])
        {
            count++;
        }

    }
    if(count == 1)
    {
        deferred.reject('Please enter your company email');
    }
    else
    {
        users.findOne({ email: userParam.email }, function (err, user)
        {
            if (err){
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            if (user)
            {
                deferred.reject('Email "' + userParam.email + '" is already taken');
            }
            else
            {
                createEmployer();
            }
        });
    }

    function createEmployer()
    {
        let now = new Date();
        createdDate= date.format(now, 'DD/MM/YYYY');
        var hashStr = crypto.createHash('md5').update(userParam.email).digest('hex');
        var company_info = {};
        company_info.hash = hashStr;
        company_info.email = userParam.email;
        company_info.name = userParam.first_name;
        company_info.expiry = new Date(new Date().getTime() +  1800 *1000);
        var token = jwt_hash.encode(company_info, settings.EXPRESS_JWT_SECRET, 'HS256');
        company_info.token = token;
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');
        var salt = bcrypt.genSaltSync(10);
        // add hashed password to user object
        user.password = bcrypt.hashSync(userParam.password, salt);
        let newUser = new users
        ({
            email: userParam.email,
            password: user.password,
            type: userParam.type,
            email_hash: token,
            created_date: createdDate,

        });

        newUser.save((err,user)=>
        {
            if(err)
            {
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else
                {
                    let info = new EmployerProfile
                    ({
                        _creator : newUser._id,
                        first_name : userParam.first_name,
                        last_name: userParam.last_name,
                        job_title:userParam.job_title,
                        company_name: userParam.company_name,
                        company_website:userParam.company_website,
                        company_phone:userParam.phone_number,
                        company_country:userParam.country,
                        company_city:userParam.city,
                        company_postcode:userParam.postal_code,

                    });

        info.save((err,user)=>
        {
            if(err)
            {
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else
                {
                    verify_send_email(company_info);
        deferred.resolve
        ({
            _id:user.id,
            _creator: newUser._id,
            type:newUser.type,
            email_hash:newUser.email_hash,
            email: newUser.email,
            is_approved : user.is_approved,
            token: jwt.sign({ sub: user._id }, settings.EXPRESS_JWT_SECRET)
        });
    }
    });
    }
    });
    }


    return deferred.promise;
}