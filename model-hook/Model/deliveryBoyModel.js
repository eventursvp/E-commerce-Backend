const mongoose = require('mongoose');

const deliveryBoySchema = new mongoose.Schema({
    firstName: { type: String, required: true, maxlength: 20 },
    lastName: { type: String, required: true, maxlength: 20 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, maxlength: 256 },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    phoneNo: { type: String, default: "", },
    role: { type: String, default: 'DeliveryBoy', },
    vehicleDetails: [{ type: mongoose.Schema.Types.ObjectId, ref: "VehicleDetails" }],
    idCard: [{ type: String, default: "", required: true }],
    licence: [{ type: String, default: "", required: true }],
    emailVerified: { type: Boolean, default: false },
    isLoggedOut: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    isDeactive: { type: Boolean, default: false }
}, { timestamps: true });

const DeliveryBoy = mongoose.model('DeliveryBoy', deliveryBoySchema, 'DeliveryBoy');

module.exports = DeliveryBoy;
