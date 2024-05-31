const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['Order', 'Product', 'Account', 'Promotional', 'Vendor', 'System'],
        required: true
    },
    subType: {
        type: String,
        required: true,
        enum: [
            'OrderPlaced', 'OrderShipped', 'OrderDelivered', 'OrderCancelled', 'OrderReturned',
            'PriceDrop', 'BackInStock', 'NewProductLaunch', 'ProductReviewRequest','AccountCreated', 
            'PasswordChanged', 'AccountSuspended', 'AccountReinstated',
            'NewOffers', 'SeasonalSales', 'NewOrderReceived', 'ProductReviewReceived', 
            'PaymentProcessed', 'SystemMaintenance', 'PolicyUpdates'
        ]
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        type: Schema.Types.Mixed, // This field can store any related data (e.g., orderId, productId)
        default: {}
    },
    isRead: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

const Notification = mongoose.model('Notification', NotificationSchema ,'Notification');

module.exports = Notification;
