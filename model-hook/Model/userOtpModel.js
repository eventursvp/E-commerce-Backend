const mongoose = require('mongoose');

const userOtpSchema = new mongoose.Schema({
    otp: { type: String, required: true },
    phoneNo: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expirationTime: { type: Date, required: true },
}, { timestamps: true });

const UserOtp = mongoose.model('UserOtp', userOtpSchema, 'UserOtp');

module.exports = UserOtp;
