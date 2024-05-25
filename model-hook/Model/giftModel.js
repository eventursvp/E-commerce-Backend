const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Gift = new Schema({
    message: { type: String },
    from: { type: String },
    recipientsEmail: { type: String },
    deliveryAddress: {type:String},
    giftBafBox:{type:Boolean,default:false},
    emailOnGiftMessage:{type:Boolean,default:false}

},
    {
        timestamps: true
    });

module.exports = mongoose.model('Gift', Gift,"Gift");