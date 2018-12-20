const chat = require('../../../model/chat');
const errors = require('../../services/errors');

module.exports = async function (req, res) {
    const userId = req.auth.user._id;

    const chatDoc = await chat.findOne({
        $and:[{receiver_id:req.body.receiver_id},{sender_id: userId},{msg_tag:req.body.msg_tag}]
    }).lean();
    if(chatDoc) {
        res.send({
            success:true,
            message: "employment offer already sent"
        });
    }
    else{
        errors.throwError("conversation not found" ,404);
    }
};