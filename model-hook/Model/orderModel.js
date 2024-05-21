let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let Orders = new Schema(
    {
        addedBy: { type: Schema.ObjectId, ref: "Users", index: true },
        orderStatus: {
            type: String,
            enum: ["UNSHIPPED", "PENDING", "COMPLETED", "CANCELLED", "RETURN"],
            default: "PENDING",
        },
        orderNumber: { type: String, unique: true },
        paymentMode: { type: String, enum: ["COD", "ONLINE"] },
        cartId: { type: Schema.ObjectId, ref: "Cart" },
        addressId: { type: Schema.ObjectId, ref: "Users" },
        productId: { type: Schema.ObjectId, ref: "Product" },
        quantity: { type: Number },
        price: { type: Number },
        couponCode:{type:String,default:null}
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Orders", Orders, "Orders");
