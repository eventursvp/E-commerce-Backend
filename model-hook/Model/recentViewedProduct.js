const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecentViewedProducts = new Schema({
    productId: { type: Schema.ObjectId, ref: 'Product' },
    addedBy: { type: Schema.ObjectId, ref: 'User' },
    isDeleted:{type:Boolean,default:false}
},
    {
        timestamps: true
    });

module.exports = mongoose.model('RecentViewedProducts', RecentViewedProducts,'RecentViewedProducts');