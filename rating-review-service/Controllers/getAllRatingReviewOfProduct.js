const mongoose = require("mongoose")
const ProductRatingReview = require("model-hook/Model/productRatingReviewModel")
const Product = require("model-hook/Model/productModel")
const { constants } = require("model-hook/common_function/constants")

exports.getAllRatingReviewOfProduct = async (req, res, next) => {
    try {
        const { productId, search, star, limit = 10, page = 1 } = req.body
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

        if (!constants.numberRegex.test(limit) || limit <= 0) {
            return res.status(400).send({ status: 0, message: "Invalid limit value" })
        }
        if (!constants.numberRegex.test(page) || page <= 0) {
            return res.status(400).send({ status: 0, message: "Invalid page value" })
        }

        let query = {}
        if (search) {
            if (!constants.searchPattern.test(search)) {
                return res.status(400).send({ status: 0, message: "Invalid search input" });
            }
            query = {
                $or: [
                    { review: { $regex: new RegExp(search, "i"), }, },
                ],
            };
        }

        if (star && [1, 2, 3, 4, 5].includes(star)) {
            query = {
                ...query,
                rating: star
            }
        }

        const checkProduct = await Product.findOne({ _id: productId })
        if (!checkProduct) {
            return res.status(404).send({ status: 0, message: "Product not found with given id." })
        }

        const totalCount = await ProductRatingReview.countDocuments({
            productId: new mongoose.Types.ObjectId(productId),
            rating: { $gt: 0, $lte: 5 },
            review: { $ne: "" }
        });

        let numberLimit = Number(limit) || 10;
        let numberSkip = (Number(page) - 1) * Number(limit) || 0;

        const data = await ProductRatingReview.aggregate([
            {
                $match: {
                    productId: new mongoose.Types.ObjectId(productId),
                    rating: { $gt: 0, $lte: 5 },
                    review: { $ne: "" },
                    ...query
                }
            },
            {
                $lookup: {
                    from: "User",
                    foreignField: "_id",
                    localField: "userId",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    rating: 1,
                    review: 1,
                    reviewImages: 1,
                    "user.firstName": 1,
                    "user.lastName": 1
                }
            },
            {
                $skip: numberSkip
            },
            {
                $limit: numberLimit
            }
        ])

        if (data.length > 0) {
            return res.status(200).send({ status: 1, message: "Data found", totalCount: totalCount || 0, data: data || [] })
        }
        return res.status(404).send({ status: 0, message: "Empty set", totalCount: 0, data: [] })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}
