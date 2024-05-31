const mongoose = require('mongoose');

const vehicleDetailsSchema = new mongoose.Schema({
    vehicleType: { type: String, required: true, enum: ["bike", "car", "truck"] },  // e.g :- bike, car, etc.
    vehicleNumber: { type: String, required: true, maxlength: 10 },   // GJ05AA0001
    model: { type: String, required: true, maxlength: 30 },    // Honda City
    owner: { type: String, required: true, maxlength: 40 },
    updateOnce: { type: Boolean, default: false },
    deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryBoy" }
}, { timestamps: true });

const VehicleDetails = mongoose.model('VehicleDetails', vehicleDetailsSchema, 'VehicleDetails');

module.exports = VehicleDetails;
