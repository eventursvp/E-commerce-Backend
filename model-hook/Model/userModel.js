const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, maxlength: 256 },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    phoneNo: { type: String, default: "", },
    role: { type: String, default: 'User' },
    emailVerified: { type: Boolean, default: false },
    isLoggedOut: { type: Boolean, default: false },
    is2FAEnabled: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false }
}, { timestamps: true });

const Users = mongoose.model('User', usersSchema, 'User');

module.exports = Users;
