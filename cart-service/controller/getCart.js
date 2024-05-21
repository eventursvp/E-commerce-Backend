const Cart = require('model-hook/Model/cartModel');
const User = require('model-hook/Model/adminModel');
const Product = require('model-hook/Model/productModel');

const mongoose = require('mongoose');


exports.getAllCart = async(req,res)=>{
    try {
        const {addedBy} =req.body

        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        // if (loginUser?.data?.role != 'USER') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }

        if(!(mongoose.Types.ObjectId.isValid(addedBy))){
            return res.status(403).send({status:0,message:"Invalid request",data:[]})
        }


        const aggregate = [
            { $match: { addedBy: new mongoose.Types.ObjectId(addedBy), isDeleted: false } },
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
                                        { $ne: ["$productAvailable", "OUTOFSTOCK"] },
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
                                }
                            }
                        }
                    ],
                    as: "productData"
                },
            },
            {
                $unwind: { path: "$productData", preserveNullAndEmptyArrays: true },
            },
            {
                $addFields: {
                    totalQuantity: "$quantity"
                }
            },
            {
                $group: {
                    _id: null,
                    cartData: {
                        $push: {
                            saveForLaterId: "$_id",
                            quantity: "$quantity",
                            productData: "$productData"
                        }
                    },
                    totalQuantities: { $sum: "$totalQuantity" },
                    totalAmount: { $sum: { $multiply: ["$productData.variant.price", "$quantity"] } },

                }
            },
            {
                $project: {
                    _id: 0,
                    cartData: 1,
                    totalQuantities: 1,
                    totalAmount:1
                }
            }
        ];
        const data = await Cart.aggregate(aggregate);

        if(!data || data.length ===0){
            return res.status(404).send({status:0,message:"Record not found",data:[]})
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
}