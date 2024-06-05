const Wishlist = require('model-hook/Model/wishlistModel');
const User = require('model-hook/Model/userModel');
const Product = require('model-hook/Model/productModel');
const { createApplicationLog } = require("model-hook/common_function/createLog");

const mongoose = require('mongoose');


exports.getAllWishlist = async (req, res) => {
    try {
        const { addedBy } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "User" )) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }
        
        if (!mongoose.Types.ObjectId.isValid(addedBy)) {
            return res.status(403).send({ status: 0, message: "Invalid request", data: [] });
        }

        const aggregate = [
            {
                $match: { addedBy: new mongoose.Types.ObjectId(addedBy) },
            },
            {
                $lookup: {
                    from: "Product",
                    let: { productIds: "$items" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $in: ["$_id", "$$productIds"] },
                                        { $eq: ["$isDeleted", false] },
                                        { $eq: ["$isPublic", true] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                name: 1,
                                variants: 1,
                                options: 1
                            },
                        },
                    ],
                    as: "productData",
                },
            },
            {
                $unwind: {
                    path: "$productData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "reviews",
                    let: { productId: "$productData._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$productId", "$$productId"] },
                                        { $eq: ["$isDeleted", false] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                review: 1,
                                rating: 1,
                                addedBy: 1,
                                createdAt: 1,
                            },
                        },
                    ],
                    as: "reviewData",
                },
            },
            {
                $unwind: {
                    path: "$reviewData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    productData: 1,
                    reviewData: 1
                },
            },
        ];

        const data = await Wishlist.aggregate(aggregate);

        if (!data || data.length === 0) {
            return res.status(404).send({ status: 0, message: "Record not found", data: [] });
        }

        await createApplicationLog("Wishlist", "get all wishlist", {}, {}, addedBy);

        return res.status(200).send({
            status: 1,
            message: "Record fetched successfully",
            data: data.map(item => ({
                _id: item._id,
                productData: item.productData,
                reviewData: item.reviewData
            })),
        });
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({ status: 0, message: "Internal Server Error", data: [] });
    }
};
