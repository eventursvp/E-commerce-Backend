const mongoose = require("mongoose")
const { createApplicationLog } = require("model-hook/common_function/createLog")
const Orders = require("model-hook/Model/orderModel")
const DeliveryAssignmentRequest = require("model-hook/Model/deliveryAssignmentRequestModel")
const { constants } = require("model-hook/common_function/constants")

exports.myDeliveryList = async (req, res, next) => {
    try {
        const { deliveryBoyId, paymentMode, pinCode } = req.body
        const { loginUser } = req
        if (!deliveryBoyId) {
            return res.status(400).send({ status: 0, message: "Delivery boy id is required." })
        }
        if (!mongoose.isValidObjectId(deliveryBoyId)) {
            return res.status(400).send({ status: 0, message: "Invalid delivery boy id." })
        }
        if (loginUser?._id != deliveryBoyId || loginUser?.role !== "DeliveryBoy") {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }

        let filterQuery = {}
        if (paymentMode) {
            if (!["COD", "ONLINE"].includes(paymentMode)) {
                return res.status(400).send({ status: 0, message: "Invalid payment mode." })
            }
            filterQuery = {
                ...filterQuery,
                paymentMode: paymentMode
            }
        }
        let addressQuery = {}
        if (pinCode) {
            if (!constants.numberRegex.test(pinCode) || pinCode?.length != 6) {
                return res.status(400).send({ status: 0, message: "Invalid pin code" })
            }
            addressQuery = {
                ...addressQuery,
                "address.pinCode": Number(pinCode)
            }
        }
        const deliveryAssignmentRequest = await DeliveryAssignmentRequest.find({ deliveryBoyId: deliveryBoyId, status: "ACCEPTED" })
        const orderIds = await Promise.all(deliveryAssignmentRequest.map((data) => {
            return data.orderId
        }))

        const deliveryList = await Orders.aggregate([
            {
                $match: {
                    deliveryBoyId: new mongoose.Types.ObjectId(deliveryBoyId),
                    _id: { $in: orderIds },
                    ...filterQuery
                }
            },
            {
                $lookup: {
                    from: "UserAddress",
                    localField: "addressId",
                    foreignField: "_id",
                    as: "address"
                }
            },
            {
                $unwind: {
                    path: "$address",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    ...addressQuery
                }
            },
            {
                $project: {
                    orderStatus: 1,
                    paymentMode: 1,
                    price: 1,
                    "address.address": 1,
                    "address.area": 1,
                    "address.landMark": 1,
                    "address.pinCode": 1,
                    "address.city": 1,
                    "address.state": 1,
                    "address.country": 1,
                }
            }
        ]);

        if (deliveryList && deliveryList?.length > 0) {
            await createApplicationLog("Delivery", `get My delivery list`, {}, {}, loginUser?._id)
            return res.status(200).send({ status: 1, message: "Delivery list found successful", data: deliveryList })
        }
        return res.status(404).send({ status: 0, message: "Empty set", data: [] })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}