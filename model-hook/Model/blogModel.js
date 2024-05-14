const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Blog = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
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
    isDeleted: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Blog', Blog,'Blog');

