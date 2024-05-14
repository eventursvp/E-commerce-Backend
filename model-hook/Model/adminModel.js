const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Admin = new Schema({
    fullName: {
        type: String
    },
    userName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Admin', Admin,'Admin');