const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vendor = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, default: 'Vendor' },
    email: { type: String, required: true, unique: true },
    phoneNo: { type: String, default: "", },
    password: {
        type: String
    },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },

    gstNo: {
        type: String
    },
    idProof: {
        adharCardFront: { type: String },
        adharCardBack: { type: String },
        addressProof: { type: String }
    },
    pickupAddress: {
        pincode: { type: String },
        address: { type: String },
        location: { type: String },
        city: { type: String },
        state: { type: String }
    },
    bankDetails: {
        bankName: { type: String },
        accountNo: { type: String },
        ifsc: { type: String },
        accountHolderName: { type: String },
        cancelCheck: { type: String }
    },
    emailVerified: { type: Boolean, default: false },
    isLoggedOut: { type: Boolean, default: false },
    is2FAEnabled: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false }

}, {
    timestamps: true
});

module.exports = mongoose.model('Vendor', Vendor,'Vendor');



