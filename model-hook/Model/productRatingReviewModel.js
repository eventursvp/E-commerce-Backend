const mongoose = require("mongoose")

const productRatingReview = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, default: null },
    review: { type: String, default: "" },
    reviewImages: [{ type: String }],
    likeCount: { type: Number, default: 0 },
    disLikeCount: { type: Number, default: 0 }
}, { timestamps: true })

const ProductRatingReview = mongoose.model("ProductRatingReview", productRatingReview, "ProductRatingReview")

module.exports = ProductRatingReview