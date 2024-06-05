const mongoose = require('mongoose');

const codCollectedPaymentsSchema = new mongoose.Schema({
    deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryBoy', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Orders', required: true },
    amountCollected: { type: Number, required: true },
    remarks: { type: String, default: '', maxlength: 100 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

// Add indexing for optimized queries
codCollectedPaymentsSchema.index({ deliveryBoyId: 1 });
codCollectedPaymentsSchema.index({ orderId: 1 });

const CodCollectedPayments = mongoose.model('CodCollectedPayments', codCollectedPaymentsSchema, 'CodCollectedPayments');

module.exports = CodCollectedPayments;
