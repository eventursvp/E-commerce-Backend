const mongoose = require("mongoose")

const productReviewLikes = new mongoose.Schema({
    type: { type: String, enum: ["like", "dislike"], require: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productRatingReviewId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductRatingReview", required: true }
}, { timestamps: true })

const ProductReviewLikes = mongoose.model("ProductReviewLikes", productReviewLikes, "ProductReviewLikes")

module.exports = ProductReviewLikes