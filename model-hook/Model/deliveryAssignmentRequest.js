const mongoose = require('mongoose');

const deliveryAssignmentRequestSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Orders", required: true },
    deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryBoy", required: true },
    status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "REJECTED"],
        default: "PENDING"
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

}, { timestamps: true });

const DeliveryAssignmentRequest = mongoose.model('DeliveryAssignmentRequest', deliveryAssignmentRequestSchema, 'DeliveryAssignmentRequest');

module.exports = DeliveryAssignmentRequest;
