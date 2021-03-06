const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');
const errors = require('../../services/errors');
const messages = require('../../../model/mongoose/messages');

module.exports.request = {
    type: 'get',
    path: '/messages/'
};

const querySchema = new Schema({
    sender_id: String
})

module.exports.inputValidation = {
    query: querySchema
};

module.exports.auth = async function (req) {
    await auth.isValidUser(req);
}

const checkMessageSenderType = function (userType, expectedType) {
    if (userType !== expectedType) errors.throwError("Only be called by a " + expectedType, 400);
}

module.exports.endpoint = async function (req, res) {
    const userType = req.auth.user.type;
    const sender_id = req.auth.user._id;
    let messageDoc;

    checkMessageSenderType(userType, 'company');

    messageDoc = await messages.find({
        sender_id: sender_id,
        msg_tag: 'approach'
    });
    res.send(messageDoc);
}