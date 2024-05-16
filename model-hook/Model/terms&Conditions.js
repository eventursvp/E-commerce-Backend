const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TermsAndCondition = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    addedBy: {
        type: Schema.ObjectId,
        ref: 'Admin'
    },
    isDeleted:
    {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true
    });

module.exports = mongoose.model('TermsAndConditions', TermsAndCondition,'TermsAndCondition');
