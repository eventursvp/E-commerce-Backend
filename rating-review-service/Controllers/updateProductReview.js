const mongoose = require("mongoose")
const ProductRatingReview = require("model-hook/Model/productRatingReviewModel")

exports.updateProductReview = async (req, res, next) => {
    try {
        const { ratingReviewId, userId, review } = req.body
        const reviewImages = req.files.reviewImages
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
        if (!ratingReviewId) {
            return res.status(400).send({ status: 0, message: "Rating Review id is required." })
        }
        if (!mongoose.isValidObjectId(ratingReviewId)) {
            return res.status(400).send({ status: 0, message: "Invalid rating review id." })
        }
        const data = await ProductRatingReview.findOne({
            _id: ratingReviewId,
            userId: userId
        })
        if (!data) {
            return res.status(404).send({ status: 0, message: "Data not found with given id" })
        }
        let updateObj = {}
        if (review) {
            if (review.length > 500) {
                return res.status(400).send({ status: 0, message: "Maximum 500 character allowed into review." })
            }
            updateObj.review = review
        }
        if (reviewImages && reviewImages.length > 0) {
            const urlOfReviewImages = await reviewImages.map((data) => {
                return `http://192.168.1.16:5012/upload/${data.filename}`
            })
            updateObj.reviewImages = urlOfReviewImages
        }
        const updateData = await ProductRatingReview.findOneAndUpdate({ _id: ratingReviewId, userId: userId }, updateObj, { new: true })
        if (updateData) {
            return res.status(200).send({ status: 1, message: "updated successfully...", data: updateData })
        }
        return res.status(500).send({ status: 0, message: "Data not updated, Please try again" })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}
