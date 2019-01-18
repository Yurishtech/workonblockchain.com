const users = require('../../../model/mongoose/users');
const companies = require('../../../model/mongoose/company');
const chat = require('../../../model/chat');

const chatReminderEmail = require('../email/emails/chatReminder');
const logger = require('../logger');

module.exports = async function () {
    logger.debug('Running unread chat messages cron');

    const unreadReceiverIds = await chat.distinct("receiver_id", {is_read: 0});

    for(let i=0; i < unreadReceiverIds.length; i++){
        let userDoc = await users.findOne({ _id: unreadReceiverIds[i], is_unread_msgs_to_send: true}, {"email":1,"type":1,"disable_account":1});

        if(userDoc){
            if(userDoc.type === 'candidate'){
                    chatReminderEmail.sendEmail(userDoc.email, userDoc.disable_account, userDoc.first_name);
            }
            else{
                let companyDoc = await companies.findOne({ _creator: userDoc._id},{"first_name":1});
                if(companyDoc){
                    chatReminderEmail.sendEmail(userDoc.email, userDoc.disable_account, companyDoc.first_name);
                }
            }
        }
        else{
            logger.debug("nothing to do");
        }
    }
    logger.info('Unread chat messages email script was executed', {timestamp: Date.now()});
}