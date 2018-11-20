let Referral = require('../referrals');

module.exports.insert = async function insert(data) {
    let newDoc = new Referral(data);

    await newDoc.save();

    return newDoc._doc._id;
}

module.exports.findOne = async function findOne(selector) {
    return await Referral.findOne(selector).lean();
}

module.exports.findOneById = async function findOneById(id) {
    return await Referral.findById(id).lean();
}

module.exports.findOneByEmail = async function findOneByEmail(email) {
    return await Referral.findOne({email: email}).lean();
}

module.exports.update = async function update(selector, updateObj) {
    await Referral.findOneAndUpdate(selector, updateObj);
}

module.exports.deleteOne = async function deleteOne(selector) {
    await Referral.find(selector).remove();
}

module.exports.count = async function count(selector) {
    await Referral.find(selector).count();
}

module.exports.findWithCursor = async function findWithCursor(selector) {
    return await Referral.find(selector).cursor();
}

module.exports.findAndIterate = async function findAndIterate(selector, fn) {
    let cursor = await this.findWithCursor(selector);
    let doc = await cursor.next();

    for (null; doc !== null; doc = await cursor.next()) {
        await fn(doc);
    }
}