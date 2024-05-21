const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Faq = new Schema({
    name: { type: String, unique: true, trim: true },
    isDeleted: { type: Boolean, default: false },
    addedBy: { type: Schema.ObjectId, ref: 'Admin' },
    faqs: [{
        question: { type: String },
        answer: { type: String },
    },
    ]
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Faq', Faq,"Faq");