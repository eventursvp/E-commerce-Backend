const mongoose = require('mongoose');

const gaveChangeToDeliveryBoySchema = new mongoose.Schema({
    deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryBoy', required: true },
    amountGiven: { type: Number, required: true },
    amountReturned: { type: Number, default: 0 },
    amountReturnedDate: { type: Date, default: "" },
    coinsAndNotes: [{
        type: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    status: { type: String, enum: ['GIVEN', 'RETURNED'], default: 'GIVEN' },
    notes: { type: String, maxlength: "100" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, {
    timestamps: true
});

const GaveChangeToDeliveryBoy = mongoose.model("GaveChangeToDeliveryBoy", gaveChangeToDeliveryBoySchema, "GaveChangeToDeliveryBoy");

module.exports = GaveChangeToDeliveryBoy;
