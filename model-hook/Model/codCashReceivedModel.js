const mongoose = require("mongoose")

const codCashReceivedSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Orders', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paymentMethod: { type: String, enum: ['ONLINE', 'CASH'], required: true },
    transactionId: { type: String, default: null }, // For online payments
    paymentAmount: { type: Number, required: true },
    tipAmount: { type: Number, default: 0 },
    paymentDate: { type: Date, default: Date.now },
    deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryBoy" }
}, { timestamps: true })

const CodCashReceived = mongoose.model("CodCashReceived", codCashReceivedSchema, "CodCashReceived")

module.exports = CodCashReceived