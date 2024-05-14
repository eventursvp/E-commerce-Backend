const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Wishlist = new Schema({
    addedBy: { type: Schema.ObjectId, ref: 'Users' },
    items: [{ type: Schema.ObjectId, ref: 'Product' }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Wishlist', Wishlist,'Wishlist');
