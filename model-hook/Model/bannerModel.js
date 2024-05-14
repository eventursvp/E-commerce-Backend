const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Banner = new Schema({
    title: { type: String },
    url: { type: String },
    image: { type: String },
    isDeleted: { type: Boolean, default: false },
    addedBy: { type: Schema.ObjectId, ref: 'Admin' }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Banner', Banner,'Banner');