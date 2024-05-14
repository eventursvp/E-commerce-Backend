const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Offer = new Schema({
    name: { type: String, unique: true },
    discountType: { type: String, enum: ["PERCENTAGE","AMOUNT"] },
    offerStatus: { type: String, enum: ["ACTIVE"," EXPIRY"] },
    discountCode: { type: String, unique: true },
    minimumPurchaseAmount: { type: Number },
    numberOfPurchase: { type: Number },
    limitOfPurchaseUser: { type: Number },
    numberOfUse: { type: Number, default: 0 },
    startDate: { type: String },
    endDate: { type: String },
    addedBy: { type: Schema.ObjectId, ref: 'Admin' },
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Offer', Offer,'Offer');