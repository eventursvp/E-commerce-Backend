const mongoose = require('mongoose');

const blockListTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const BlockListToken = mongoose.model('BlockListToken', blockListTokenSchema, 'BlockListToken');

module.exports = BlockListToken;
