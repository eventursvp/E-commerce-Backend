const Order = require("model-hook/Model/orderModel");
const User = require("model-hook/Model/userModel");
const Product = require("model-hook/Model/productModel");
const Cart = require("model-hook/Model/cartModel");
const mongoose = require("mongoose");

exports.getOrder = async (req, res) => {
    try {
        const { orderId, addedBy } = req.body;

        if (
            !(
                mongoose.Types.ObjectId.isValid(orderId) &&
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

        const aggregate = [];

        aggregate.push(
            {
                $match: { _id: new mongoose.Types.ObjectId(orderId) },
            },
            {
                $lookup: {
                    from: "Product",
                    let: { productId: "$productId", variantId: "$variantId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$productId"] },
                                        { $eq: ["$isDeleted", false] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                name: 1,
                                variant: {
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
                    from: "User",
                    let: { userId: "$addedBy", addressId: "$addressId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$userId"] },
                                        { $eq: ["$isDeleted", false] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                address: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$addresses",
                                                as: "address",
                                                cond: {
                                                    $eq: [
                                                        "$$address._id",
                                                        "$$addressId",
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
                    as: "addressData",
                },
            },
            {
                $unwind: {
                    path: "$addressData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    orderStatus: 1,
                    orderNumber: 1,
                    paymentMode: 1,
                    quantity: 1,
                    price: 1,
                    productData: 1,
                    addressData: 1,
                    createdAt: 1,
                },
            },
            {
                $group: {
                    _id: null,
                    orderDetails: { $push: "$$ROOT" },
                    totalAmount: {
                        $sum: { $multiply: ["$price", "$quantity"] },
                    },
                },
            },
            { $unset: ["_id"] }
        );
        const data = await Order.aggregate(aggregate);

        if (!data) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }

        return res.status(403).send({
            status: 0,
            message: "Record fetched successfully",
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


exports.getAllOrders = async(req,res)=>{
    try {
        const {  addedBy } = req.body;

        if (
            !(
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

        const aggregate = [];

        aggregate.push(
            {
                $match: { addedBy: new mongoose.Types.ObjectId(addedBy) },
            },
            {
                $lookup: {
                    from: "Product",
                    let: { productId: "$productId", variantId: "$variantId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$productId"] },
                                        { $eq: ["$isDeleted", false] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                name: 1,
                                variant: {
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
                    from: "User",
                    let: { userId: "$addedBy", addressId: "$addressId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$userId"] },
                                        { $eq: ["$isDeleted", false] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                address: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$addresses",
                                                as: "address",
                                                cond: {
                                                    $eq: [
                                                        "$$address._id",
                                                        "$$addressId",
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
                    as: "addressData",
                },
            },
            {
                $unwind: {
                    path: "$addressData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    orderStatus: 1,
                    orderNumber: 1,
                    paymentMode: 1,
                    quantity: 1,
                    price: 1,
                    productData: 1,
                    addressData: 1,
                    createdAt: 1,
                },
            },
            {
                $group: {
                    _id: null,
                    orderDetails: { $push: "$$ROOT" },
                    totalAmount: {
                        $sum: { $multiply: ["$price", "$quantity"] },
                    },
                },
            },
            { $unset: ["_id"] }
        );
        const data = await Order.aggregate(aggregate);

        if (!data) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }

        return res.status(200).send({
            status: 0,
            message: "Record fetched successfully",
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
}


exports.getAdminOrders = async(req,res)=>{
    try {
        const {addedBy,skip = undefined, limit = undefined, search} = req.body


        if ( !mongoose.Types.ObjectId.isValid(addedBy) )
         {
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

        let sorting = { _id: -1 }

        const aggregate = [
            // { $match: { ...condition } },
            { $sort: sorting }
        ];
        if (typeof skip !== "undefined" && typeof limit !== "undefined") {
            aggregate.push({ $skip: skip }, { $limit: limit }, { $sort: sorting });
        }
        aggregate.push(
            {
                $lookup: {
                    from: "Product",
                    let: { "productId": "$productId", "variantId": "$variantId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$productId"] },
                                        { $eq: ["$isDeleted", false] },
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                variant: {
                                    $arrayElemAt: [{
                                        $filter: {
                                            input: '$variants',
                                            as: 'variant',
                                            cond: { $eq: ['$$variant._id', '$$variantId'] }
                                        }
                                    }, 0]
                                },
                            }
                        }
                    ],
                    as: "productData"
                },
            },
            {
                $unwind: { path: "$productData", preserveNullAndEmptyArrays: true },
            },
            // {
            //     $match:{"productData.addedBy":new mongoose.Types.ObjectId(addedBy)}
            // },
            {
                $lookup: {
                    from: "User",
                    let: { "userId": "$addedBy" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$userId"] },
                                        { $eq: ["$isDeleted", false] },
                                        { $eq: ["$isBlocked", false] },
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                firstName: 1,
                                lastName: 1,
                                email: 1,
                                mobile: 1,
                            }
                        }
                    ],
                    as: "userData"
                },
            },
            {
                $unwind: { path: "$userData", preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: "UserAddress",
                    let: { "userId": "$addedBy", "addressId": "$addressId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userId", "$$userId"] },
                                        { $eq: ["$_id", "$$addressId"] },
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                address: 1,
                                area: 1,
                                landMark: 1,
                                pinCode: 1,
                                city:1,
                                state:1,
                                country:1
                            }
                        }
                    ],
                    as: "UserAddressData"
                },
            },
            {
                $unwind: { path: "$UserAddressData", preserveNullAndEmptyArrays: true },
            },
        )
        const data = await Order.aggregate(aggregate);

        if (!data) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }

        return res.status(200).send({
            status: 0,
            message: "Record fetched successfully",
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
}