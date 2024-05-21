const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserCoupon = new Schema({
    title: { type: String },
    code: { type: String,unique:true },
    startDate:{type:Date,require:true},
    endDate:{type:Date,require:true},
    productIds:[{type:Schema.ObjectId,ref:'Product'}],
    discountType: { type: String, enum: ["PERCENTAGE","AMOUNT"] },
    discountValue: { type: Number, required: true }, 
    usedCount: { type: Number, default: 0 }, 
    isActive: { type: Boolean, default: true },    
    maxUses: { type: Number, default: 1 },
    addedBy: { type: Schema.ObjectId, ref: 'Admin' },
    isDeleted:{type:Boolean,default:false}
},
    {
        timestamps: true
    });

module.exports = mongoose.model('UserCoupon', UserCoupon,'UserCoupon');