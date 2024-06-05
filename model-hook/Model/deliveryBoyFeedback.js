const mongoose = require('mongoose');

const deliveryBoyFeedbackSchema = new mongoose.Schema({
    deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryBoy', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Orders', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 200 },
}, {
    timestamps: true
});

const DeliveryBoyFeedback = mongoose.model('DeliveryBoyFeedback', deliveryBoyFeedbackSchema, 'DeliveryBoyFeedback');

module.exports = DeliveryBoyFeedback;
