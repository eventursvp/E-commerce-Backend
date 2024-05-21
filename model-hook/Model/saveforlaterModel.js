const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SaveForLater = new Schema({
    cartId: {
        type: Schema.ObjectId,
        ref: 'Cart'
    },
    productId: {
        type: Schema.ObjectId,
        ref: 'Product'
    },
    variantId: {
        type: Schema.ObjectId,
        ref: 'Product'
    },
    addedBy: {
        type: Schema.ObjectId,
        ref: 'Admin'
    },
    isDeleted:
    {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true
    });

module.exports = mongoose.model('SaveForLater', SaveForLater,'SaveForLater');
