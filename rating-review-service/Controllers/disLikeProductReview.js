const mongoose = require("mongoose")
const ProductReviewLikes = require("model-hook/Model/productReviewLikesModel")
const ProductRatingReview = require("model-hook/Model/productRatingReviewModel")
const Product = require("model-hook/Model/productModel")

exports.disLikeProductReview = async (req, res, next) => {
    try {
        const { productRatingReviewId, userId, productId } = req.body
        const { loginUser } = req

        if (!userId) {
            return res.status(400).send({ status: 0, message: "User Id is required." })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." });
        }
        if (loginUser?._id != userId || loginUser?.role !== "User") {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }

        if (!productRatingReviewId) {
            return res.status(400).send({ status: 0, message: "Product rating review id is required." })
        }
        if (!mongoose.isValidObjectId(productRatingReviewId)) {
            return res.status(400).send({ status: 0, message: "Invalid product rating review id." })
        }
        const checkReview = await ProductRatingReview.findOne({
            _id: productRatingReviewId,
        })
        if (!checkReview) {
            return res.status(404).send({ status: 0, message: "Product review not found with given id" })
        }

        if (!productId) {
            return res.status(400).send({ status: 0, message: "Product id is required." })
        }
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).send({ status: 0, message: "Invalid product id." })
        }
        const checkProduct = await Product.findOne({ _id: productId })
        if (!checkProduct) {
            return res.status(404).send({ status: 0, message: "Product not found with given id" })
        }

        const checkAlreadyDisLiked = await ProductReviewLikes.findOne({
            type: "dislike",
            userId: userId,
            productId: productId,
            productRatingReviewId: productRatingReviewId
        })
        if (checkAlreadyDisLiked) {
            const removeLikeReview = await ProductReviewLikes.findOneAndDelete({
                type: "dislike",
                userId: userId,
                productId: productId,
                productRatingReviewId: productRatingReviewId
            })
            if (removeLikeReview) {
                const decreaseDisLike = await ProductRatingReview.findOneAndUpdate({
                    userId: userId,
                    productId: productId
                }, {
                    $inc: { disLikeCount: -1 }
                }, {
                    new: true
                })
                if (decreaseDisLike) {
                    return res.status(200).send({ status: 1, message: "Review un-dislike successfully" })
                }
            } else {
                return res.status(400).send({ status: 1, message: "Review not un-dislike, Please try again" })
            }
        } else {
            const dislikeReview = await ProductReviewLikes.create({
                type: "dislike",
                userId: userId,
                productId: productId,
                productRatingReviewId: productRatingReviewId
            })
            if (dislikeReview) {
                const increaseDislike = await ProductRatingReview.findOneAndUpdate({
                    userId: userId,
                    productId: productId
                }, {
                    $inc: { disLikeCount: 1 }
                }, {
                    new: true
                })
                if (increaseDislike) {
                    const removeLikeReview = await ProductReviewLikes.findOneAndDelete({
                        type: "like",
                        userId: userId,
                        productId: productId,
                        productRatingReviewId: productRatingReviewId
                    })
                    if (removeLikeReview) {
                        const decreaseLike = await ProductRatingReview.findOneAndUpdate({
                            userId: userId,
                            productId: productId
                        }, {
                            $inc: { likeCount: -1 }
                        }, {
                            new: true
                        })
                    }
                    return res.status(200).send({ status: 1, message: "Review disliked successfully" })
                } else {
                    return res.status(400).send({ status: 0, message: "Review not dislikes, Please try again" })
                }
            }
        }

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}
