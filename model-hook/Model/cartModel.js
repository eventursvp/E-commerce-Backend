const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cart = new Schema({
    addedBy: { type: Schema.ObjectId, ref: 'Users', index: true },
    status: { type: Number, default: 1 }, //1 - use ,2 - unUsed,
    productId: { type: Schema.ObjectId, ref: 'Product' },
    // price: { type: Number },
    quantity: { type: Number, default: 1 },
    isDeleted:{type:Boolean,default:false},
    variantId: { type: Schema.ObjectId, ref: 'Product' },

    
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', Cart,'Cart');
