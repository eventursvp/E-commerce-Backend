const mongoose = require("mongoose")
const ProductRatingReview = require("model-hook/Model/productRatingReviewModel")
const Order = require("model-hook/Model/orderModel")
const Product = require("model-hook/Model/productModel")
const { constants } = require("model-hook/common_function/constants")

exports.addProductRating = async (req, res, next) => {
    try {
        const { userId, productId, rating } = req.body
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

        if (!productId) {
            return res.status(400).send({ status: 0, message: "Product id is required." })
        }

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).send({ status: 0, message: "Invalid product id." })
        }

        const checkProduct = await Product.findOne({ _id: productId })

        if (!checkProduct) {
            return res.status(404).send({ status: 0, message: "Product not found with given id." })
        }

        const orderData = await Order.findOne({ addedBy: userId, productId: productId })

        if (!orderData) {
            return res.status(404).send({ status: 0, message: "Order not found with given product id." })
        }

        if (orderData.orderStatus !== "COMPLETED") {
            return res.status(400).send({ status: 0, message: "Rating is gives after order placed." })
        }

        if (![1, 2, 3, 4, 5].includes(rating) || typeof (rating) !== 'number') {
            return res.status(400).send({ status: 0, message: "Invalid Rating value." })
        }

        const alreadyHave = await ProductRatingReview.findOne({ userId: userId, productId: productId })

        if (alreadyHave) {
            if ([1, 2, 3, 4, 5].includes(alreadyHave.rating)) {
                return res.status(400).send({ status: 0, message: "Rating Already added." })
            }
            const updateRating = await ProductRatingReview.findOneAndUpdate({ userId: userId, productId: productId }, { rating: rating }, { new: true })
            if (updateRating) {
                return res.status(500).send({ status: 0, message: "Product Rating added.", data: updateRating })
            }
        }

        const addRating = await ProductRatingReview.create({
            userId: userId,
            productId,
            rating,
            review: "",
            reviewImages: []
        })

        if (addRating) {
            return res.status(201).send({ status: 1, message: "Product rating added", data: addRating })
        }

        return res.status(500).send({ status: 0, message: "Product rating not added, Please try again" })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}
