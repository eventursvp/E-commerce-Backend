const Product = require("model-hook/Model/productModel");
const Admin = require("model-hook/Model/adminModel");
const RecentViewedProducts = require("model-hook/Model/recentViewedProduct");
const mongoose = require("mongoose");

exports.getOneProduct = async (req, res) => {
    try {
        const { productId, addedBy } = req.body;

        if (
            !(
                mongoose.Types.ObjectId.isValid(productId) &&
                mongoose.Types.ObjectId.isValid(addedBy)
            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }
        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin")) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (!(productId && addedBy)) {
            return res
                .status(403)
                .send({ status: 0, message: "All fields are required" });
        }

        const data = await Product.findOne({
            _id: productId,
            isPublic: true,
            isDeleted: false,
        });

        if (!data) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }

        // if (data && loginUser?.data?.role === "USER") {

        const alreadyExist = await RecentViewedProducts.findOne({
            productId: productId,
            addedBy: addedBy,
        });

        if (!alreadyExist) {
            await RecentViewedProducts.create({
                productId: productId,
                addedBy: addedBy,
            });
        }

        // }

        return res.status(200).send({
            status: 1,
            message: "Record fetched successful",
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

exports.getAllProducts = async (req, res) => {
    try {
        const {
            userId,
            categoryId,
            subCategoryId,
            specificCategoryIds,
            colors,
            sizes,
            skip,
            limit,
            filter,
            minPrice,
            maxPrice,
        } = req.body;

        let condition = { isDeleted: false, isPublic: true };

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }
        if (!userId) {
            return res
                .status(403)
                .send({ status: 0, message: "All fields are required" });
        }

        if (categoryId) {
            condition.categoryId = new mongoose.Types.ObjectId(categoryId);
        }
        if (subCategoryId) {
            condition.subCategoryId = new mongoose.Types.ObjectId(
                subCategoryId
            );
        }

        if (specificCategoryIds) {
            condition.specificIdCategoryId = new mongoose.Types.ObjectId(
                specificCategoryIds
            );
        }

        if (minPrice !== undefined && maxPrice !== undefined) {
            condition["variants.price"] = { $gte: minPrice, $lte: maxPrice };
        }

        if (typeof search !== "undefined") {
            condition.name = new RegExp(search, "ig");
        }
        if (typeof colors == "string") {
            colors = JSON.parse(colors);
        }
        if (colors !== undefined) {
            color = colors.map((color) => color);
            condition["options.values"] = { $in: color };
        }
        if (typeof sizes == "string") {
            sizes = JSON.parse(sizes);
        }
        if (sizes !== undefined) {
            size = sizes.map((size) => size);
            condition["options.values"] = { $in: size };
        }
        let sorting;
        if (filter == "high") {
            sorting = { "variants.price": -1 };
        } else if (filter == "low") {
            sorting = { "variants.price": 1 };
        } else {
            sorting = { _id: -1 };
        }

        const aggregate = [];
        if (typeof skip !== "undefined" && typeof limit !== "undefined") {
            aggregate.push(
                { $skip: skip },
                { $limit: limit },
                { $sort: sorting }
            );
        }
        aggregate.push(
            { $match: condition },
            { $sort: sorting },
            {
                $lookup: {
                    from: "Brand",
                    let: { brandId: "$brandId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$brandId"] },
                                        { $eq: ["$isDeleted", false] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                name: 1,
                            },
                        },
                    ],
                    as: "brandData",
                },
            },
            {
                $unwind: {
                    path: "$brandData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "Categories",
                    let: { categoryId: "$categoryId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$categoryId"] },
                                        { $eq: ["$isDeleted", false] },
                                        { $eq: ["$active", true] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                name: 1,
                            },
                        },
                    ],
                    as: "categoryData",
                },
            },
            {
                $unwind: {
                    path: "$categoryData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "SubCategories",
                    let: { subCategoryId: "$subCategoryId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$subCategoryId"] },
                                        { $eq: ["$isDeleted", false] },
                                        { $eq: ["$active", true] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                name: 1,
                            },
                        },
                    ],
                    as: "subCategoryData",
                },
            },
            {
                $unwind: {
                    path: "$subCategoryData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "Categories",
                    let: { specificIdCategoryId: "$specificIdCategoryId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                "$_id",
                                                "$$specificIdCategoryId",
                                            ],
                                        },
                                        { $eq: ["$isDeleted", false] },
                                        { $eq: ["$active", true] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                name: 1,
                            },
                        },
                    ],
                    as: "specificCategoryData",
                },
            },
            {
                $unwind: {
                    path: "$specificCategoryData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "reviews",
                    let: { productId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$productId", "$$productId"] },
                                        { $eq: ["$isDeleted", false] },
                                        { $eq: ["$isPublic", true] },
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
                $lookup: {
                    from: "users",
                    let: { userId: "$reviewData.addedBy" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$userId"] },
                                        { $eq: ["$isDeleted", false] },
                                        { $eq: ["$isBlocked", false] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                firstName: 1,
                                lastName: 1,
                                email: 1,
                                mobile: 1,
                            },
                        },
                    ],
                    as: "reviewData.userData",
                },
            },
            {
                $unwind: {
                    path: "$reviewData.userData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    root: { $first: "$$ROOT" },
                    reviewData: { $push: "$reviewData" },
                },
            },
            {
                $addFields: {
                    reviewData: {
                        $filter: {
                            input: "$reviewData",
                            as: "reviewData",
                            cond: {
                                $ne: [{ $type: "$$reviewData._id" }, "missing"],
                            },
                        },
                    },
                },
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$root", { reviewData: "$reviewData" }],
                    },
                },
            }
        );
        aggregate.push({
            $sort: sorting,
        });

        const data = await Product.aggregate(aggregate);

        if (!data || data.length === 0) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }

        return res.status(200).send({
            status: 1,
            message: "Record fetched successful",
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

exports.compareProduct = async (req, res) => {
    try {
        const { productIds, addedBy } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (
            !Array.isArray(productIds) ||
            productIds.length < 2 ||
            !productIds.every((id) => mongoose.Types.ObjectId.isValid(id))
        ) {
            return res
                .status(400)
                .send({ status: 0, message: "Invalid productIds", data: [] });
        }

        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== productIds.length) {
            return res.status(404).send({
                status: 0,
                message: "Some products not found",
                data: [],
            });
        }

        return res.status(200).send({
            status: 1,
            message: "Record fetched successfully",
            data: products,
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

exports.getSimilarProducts = async (req, res) => {
    try {
        const { productId, addedBy } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (
            !mongoose.Types.ObjectId.isValid(productId) &&
            !mongoose.Types.ObjectId.isValid(addedBy)
        ) {
            return res
                .status(400)
                .send({ status: 0, message: "Invalid request", data: [] });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res
                .status(404)
                .send({ status: 0, message: "Record not found 1", data: [] });
        }

        const { categoryId, subCategoryId, specificIdCategoryId, brandId } =
            product;

        const similarProducts = await Product.find({
            $or: [
                { categoryId },
                { subCategoryId },
                { specificIdCategoryId },
                { brandId },
            ],
            _id: { $ne: productId },
        }).limit(5);

        if (!similarProducts) {
            return res
                .status(404)
                .send({ status: 0, message: "Record not found 2", data: [] });
        }

        return res.status(200).send({
            status: 1,
            message: "Record fetched successfully",
            data: similarProducts,
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

exports.getRecentlyViewedProducts = async (req, res) => {
    try {
        const { addedBy } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if(!addedBy){
            return res
            .status(403)
            .send({ status: 0, message: "All fields are required", data: [] });
        }
        if (!mongoose.Types.ObjectId.isValid(addedBy)) {
            return res
                .status(400)
                .send({ status: 0, message: "Invalid request", data: [] });
        }

        const aggregate = [
            { $match: { addedBy: new mongoose.Types.ObjectId(addedBy),isDeleted:false } },
            {
                $lookup: {
                    from: "Product",
                    let: { productId: "$productId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$productId"] },
                                        { $eq: ["$isDeleted", false] },
                                        { $eq: ["$isPublic", true] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                name: 1,
                                images: 1,
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
                $sort: { createdAt: -1 },
            },
            {
                $project: {
                    _id: "$productData._id",
                    name: "$productData.name",
                    images: "$productData.images",
                },
            },
        ];

        const recentlyViewedProducts = await RecentViewedProducts.aggregate(
            aggregate
        );

        if (!recentlyViewedProducts || recentlyViewedProducts.length === 0) {
            return res.status(404).send({
                status: 0,
                message: "No recently viewed products found",
                data: [],
            });
        }

        return res.status(200).send({
            status: 1,
            message: "Record fetched successfully",
            data: recentlyViewedProducts,
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
