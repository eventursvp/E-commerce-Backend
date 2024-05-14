const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WishlistCollection = new Schema(
    {
        name: { type: String },
        addedBy: { type: Schema.ObjectId, ref: "Users" },
        items: [{
            productId: { type: Schema.ObjectId, ref: 'Product' },
            price: { type: Number },
            quantity: { type: Number, default: 1 },
            variantId: { type: Schema.ObjectId, ref: 'Product' },
        },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "WishlistCollection",
    WishlistCollection,
    "WishlistCollection"
);
