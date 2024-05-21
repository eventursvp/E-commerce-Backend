const mongoose = require('mongoose');

const userAddressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fullName: { type: String, required: true, maxlength: 50 },
    address: { type: String, default: "", required: true, maxlength: 100 },
    area: { type: String, default: "", maxlength: 100 },
    landMark: { type: String, default: "", maxlength: 100 },
    pinCode: { type: Number, required: true, maxlength: 6 },
    city: { type: String, required: true, maxlength: 100 },
    state: { type: String, required: true, maxlength: 60 },
    country: { type: String, required: true, maxlength: 40 },
    defaultAddress: { type: Boolean, default: false, required: true }
}, { timestamps: true });

const UserAddress = mongoose.model('UserAddress', userAddressSchema, 'UserAddress');

module.exports = UserAddress;
