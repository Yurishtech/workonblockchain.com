const emails = require('../emails');

module.exports.sendEmail = function sendEmail(email,name,isAccountDisabed) {
    const sendTo = {
        email:email
    };
    const subject = "Your account has been approved!";

    const sendToArray = [sendTo];

    const sendGridOptions = {
        templateId: "d-02056a2f353b4493894597caeda49ba6",
        subject: subject,
        personalizations: [{
            to: {
                email: email,
                name: name
            }
        }],
        templateData: {
            firstName: name
        }
    };

    emails.sendEmail(sendGridOptions, isAccountDisabed);
}