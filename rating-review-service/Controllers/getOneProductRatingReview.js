const mongoose = require("mongoose")
const ProductRatingReview = require("model-hook/Model/productRatingReviewModel")
const Product = require("model-hook/Model/productModel")

exports.getOneProductRatingReview = async (req, res, next) => {
    try {
        const { ratingReviewId } = req.body
        // const { loginUser } = req
        // if (!userId) {
        //     return res.status(400).send({ status: 0, message: "User Id is required." })
        // }
        // if (!mongoose.isValidObjectId(userId)) {
        //     return res.status(400).send({ status: 0, message: "Invalid user id." });
        // }
        // if (loginUser?._id != userId || loginUser?.role !== "User") {
        //     return res.status(403).send({ status: 0, message: "Unauthorized access." })
        // }
        
        if (!ratingReviewId) {
            return res.status(400).send({ status: 0, message: "Rating Review id is required." })
        }
        if (!mongoose.isValidObjectId(ratingReviewId)) {
            return res.status(400).send({ status: 0, message: "Invalid rating review id." })
        }
        const data = await ProductRatingReview.findOne({
            _id: ratingReviewId
        })

        if (data) {
            return res.status(200).send({ status: 1, message: "Data found", data: data })
        }
        return res.status(404).send({ status: 0, message: "Data not found with given id" })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}
