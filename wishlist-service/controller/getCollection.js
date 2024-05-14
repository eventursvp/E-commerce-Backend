const WishlistCollection = require("model-hook/Model/wishlistCollectionModel");
const User = require("model-hook/Model/adminModel");
const Product = require("model-hook/Model/productModel");

const mongoose = require("mongoose");

exports.getOneWishlistCollection = async (req, res) => {
    try {
        const { collectionId, addedBy } = req.body;

        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        // if (loginUser?.data?.role != 'USER') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }

        if (
            !(
                mongoose.Types.ObjectId.isValid(addedBy) &&
                mongoose.Types.ObjectId.isValid(collectionId)
            )
        ) {
            return res
                .status(403)
                .send({ status: 0, message: "Invalid request", data: [] });
        }

        const aggregate = [];

        aggregate.push(
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(collectionId),
                    addedBy: new mongoose.Types.ObjectId(addedBy),
                },
            },
            {
                $unwind: { path: "$items", preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: "Product",
                    let: {
                        productId: "$items.productId",
                        variantId: "$items.variantId",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$productId"] },
                                        // { $eq: ["$variants._id", "$$variantId"] },
                                        { $eq: ["$isDeleted", false] },
                                        { $eq: ["$isPublic", true] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                name: 1,
                                variants: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$variants",
                                                as: "variant",
                                                cond: {
                                                    $eq: [
                                                        "$$variant._id",
                                                        "$$variantId",
                                                    ],
                                                },
                                            },
                                        },
                                        0,
                                    ],
                                },
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
                    let: { productId: "$productId" },
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
                    reviewData: 1,
                },
            }
        );

        const data = await WishlistCollection.aggregate(aggregate);

        if (!data || data.length === 0) {
            return res
                .status(404)
                .send({ status: 0, message: "Record not found", data: [] });
        }

        return res.status(200).send({
            status: 1,
            message: "Record fetched Successfull!",
            data: data,
        });
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
};

exports.getAllWishlistCollection = async (req, res) => {
    try {
        const { addedBy } = req.body;

        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        // if (loginUser?.data?.role != 'USER') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }

        if (!mongoose.Types.ObjectId.isValid(addedBy)) {
            return res
                .status(403)
                .send({ status: 0, message: "Invalid request", data: [] });
        }

        const data = await WishlistCollection.find({ addedBy: addedBy });

        if (!data || data.length === 0) {
            return res
                .status(404)
                .send({ status: 0, message: "Record not found", data: [] });
        }

        const collectionData = data.map((data) => {
            return { _id: data._id, name: data.name };
        });
        return res.status(200).send({
            status: 1,
            message: "Record fetched Successfull!",
            data: collectionData,
        });
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
};
