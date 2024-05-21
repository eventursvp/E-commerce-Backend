const mongoose = require("mongoose")
const ProductRatingReview = require("model-hook/Model/productRatingReviewModel")
const Product = require("model-hook/Model/productModel")

exports.getStarWiseRating = async (req, res, next) => {
    try {
        const { productId } = req.body
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

        const totalCount = await ProductRatingReview.countDocuments({
            productId: new mongoose.Types.ObjectId(productId),
            rating: { $ne: null, $ne: "" }
        });

        const data = await ProductRatingReview.aggregate([
            {
                $match: {
                    productId: new mongoose.Types.ObjectId(productId),
                    rating: { $ne: [null, ""] }
                }
            },
            {
                $project: {
                    rating: 1
                }
            },
            {
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 }
                }
            },
        ])

        const result = [];
        for (let i = 1; i <= 5; i++) {
            const starData = data.find(item => item._id === i);
            if (starData) {
                result.push({
                    star: i,
                    average: (starData.count * 100) / totalCount,
                    count: starData.count
                });
            } else {

                result.push({
                    star: i,
                    average: 0,
                    count: 0
                });
            }
        }

        let totalRatings = 0;
        let totalStars = 0;
        result.forEach(item => {
            totalRatings += item.star * item.count;
            totalStars += item.count;
        });

        const averageStar = totalRatings > 0 ? (totalRatings / totalStars).toFixed(1) : 0;

        if (data.length > 0) {
            return res.status(200).send({ status: 1, message: "Data found", totalCount: totalCount, averageStar: Number(averageStar), result: result })
        }
        return res.status(404).send({ status: 0, message: "Empty set", totalCount: 0, data: [] })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}
