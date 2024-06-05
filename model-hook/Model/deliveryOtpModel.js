const mongoose = require('mongoose');

const deliveryOtpSchema = new mongoose.Schema({
    deliveryAssignmentRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryAssignmentRequest', required: true },
    deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryBoy', required: true },
    otp: { type: String, required: true },
    expirationTime: { type: Date, required: true }
}, {
    timestamps: true
});

const DeliveryOtp = mongoose.model('DeliveryOtp', deliveryOtpSchema, 'DeliveryOtp');

module.exports = DeliveryOtp;
