const mongoose = require("mongoose")
const fs = require("fs")
const ProductRatingReview = require("model-hook/Model/productRatingReviewModel")
const Order = require("model-hook/Model/orderModel")
const Product = require("model-hook/Model/productModel")
const { constants } = require("model-hook/common_function/constants")

exports.addProductReview = async (req, res, next) => {
    try {
        const { userId, productId, review } = req.body
        const reviewImages = req?.files?.reviewImages
        const { loginUser } = req

        if (!userId) {
            await removeImage(reviewImages)
            return res.status(400).send({ status: 0, message: "User Id is required." })
        }

        if (!mongoose.isValidObjectId(userId)) {
            await removeImage(reviewImages)
            return res.status(400).send({ status: 0, message: "Invalid user id." });
        }

        if (loginUser?._id != userId || loginUser?.role !== "User") {
            await removeImage(reviewImages)
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }

        if (!productId) {
            await removeImage(reviewImages)
            return res.status(400).send({ status: 0, message: "Product id is required." })
        }

        if (!mongoose.isValidObjectId(productId)) {
            await removeImage(reviewImages)
            return res.status(400).send({ status: 0, message: "Invalid product id." })
        }

        const checkProduct = await Product.findOne({ _id: productId })

        if (!checkProduct) {
            await removeImage(reviewImages)
            return res.status(404).send({ status: 0, message: "Product not found with given id." })
        }

        if (!review) {
            await removeImage(reviewImages)
            return res.status(400).send({ status: 0, message: "Review is required." })
        }

        if (review.length > 500) {
            return res.status(400).send({ status: 0, message: "Maximum 500 character allowed into review." })
        }

        const alreadyHave = await ProductRatingReview.findOne({ userId: userId, productId: productId })

        const rating = alreadyHave?.rating ? alreadyHave?.rating : req.body.rating

        if (!rating) {
            await removeImage(reviewImages)
            return res.status(400).send({ status: 0, message: "Rating is required." })
        }

        if (typeof (rating) !== 'number' || ![1, 2, 3, 4, 5].includes(rating)) {
            await removeImage(reviewImages)
            return res.status(400).send({ status: 0, message: "Invalid Rating value." })
        }

        const orderData = await Order.findOne({ addedBy: userId, productId: productId })

        if (!orderData) {
            await removeImage(reviewImages)
            return res.status(404).send({ status: 0, message: "Order not found with given product id." })
        }

        if (orderData.orderStatus !== "COMPLETED") {
            await removeImage(reviewImages)
            return res.status(400).send({ status: 0, message: "Rating is gives after order placed." })
        }

        let urlOfReviewImages = []
        if (reviewImages && reviewImages.length > 0) {
            urlOfReviewImages = await reviewImages.map((data) => {
                return `http://192.168.1.16:5012/upload/${data.filename}`
            })
        }

        if (alreadyHave) {
            if (alreadyHave.review && [1, 2, 3, 4, 5].includes(alreadyHave.rating)) {
                await removeImage(reviewImages)
                return res.status(400).send({ status: 0, message: "Review Already added." })
            }
            const updateReview = await ProductRatingReview.findOneAndUpdate({ userId: userId, productId: productId }, { review: review, reviewImages: urlOfReviewImages }, { new: true })
            if (updateReview) {
                return res.status(500).send({ status: 0, message: "Product Review added.", data: updateReview })
            }
        }

        const addReview = await ProductRatingReview.create({
            userId: userId,
            productId,
            rating: rating,
            review: review,
            reviewImages: urlOfReviewImages
        })

        if (addReview) {
            return res.status(201).send({ status: 1, message: "Product review added", data: addReview })
        }

        await removeImage(reviewImages)
        return res.status(500).send({ status: 0, message: "Product review not added, Please try again" })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}

const removeImage = (reviewImages) => {
    const currentDirectory = './upload';
    if (reviewImages && reviewImages.length > 0) {
        reviewImages.forEach(async (profileImage) => {
            const imagePath = profileImage ? `${currentDirectory}/${profileImage?.filename}` : null;
            if (imagePath) {
                await fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Error deleting image:', err);
                    } else {
                        console.log('Image deleted successfully');
                    }
                });
            }
        })
    }
}