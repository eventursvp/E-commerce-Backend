const mongoose = require("mongoose")
const DeliveryAssignmentRequest = require("model-hook/Model/deliveryAssignmentRequestModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")
const { constants } = require("model-hook/common_function/constants")

exports.listOfDeliveryAssignRequest = async (req, res, next) => {
    try {
        const { deliveryBoyId, page = 1, limit = 10, status } = req.body
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
        if (status) {
            if (!["PENDING", "ACCEPTED", "REJECTED"].includes(status)) {
                return res.status(400).send({ status: 0, message: "Invalid status value." })
            }
            filterQuery = {
                status: status
            }
        }

        if (limit && (!constants.numberRegex.test(limit) || limit <= 0)) {
            return res.status(400).send({ status: 0, message: "Invalid limit value" })
        }
        if (page && (!constants.numberRegex.test(page) || page <= 0)) {
            return res.status(400).send({ status: 0, message: "Invalid page value" })
        }
        let numberLimit = Number(limit) || 10;
        let numberSkip = (Number(page) - 1) * Number(limit) || 0;

        const requestList = await DeliveryAssignmentRequest.aggregate([
            {
                $match: {
                    deliveryBoyId: new mongoose.Types.ObjectId(deliveryBoyId),
                    ...filterQuery
                }
            },
            {
                $lookup: {
                    from: "Orders",
                    foreignField: "_id",
                    localField: "orderId",
                    as: "orderData"
                }
            },
            {
                $unwind: {
                    path: "$orderData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "orderData.orderStatus": "PACKED",
                    "orderData.deliveryBoyId": null
                }
            },
            {
                $lookup: {
                    from: "UserAddress",
                    foreignField: "_id",
                    localField: "orderData.addressId",
                    as: "orderDeliveryAddress"
                }
            },
            {
                $unwind: {
                    path: "$orderDeliveryAddress",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    status: 1,
                    "orderDeliveryAddress.address": 1,
                    "orderDeliveryAddress.area": 1,
                    "orderDeliveryAddress.landMark": 1,
                    "orderDeliveryAddress.pinCode": 1,
                    "orderDeliveryAddress.city": 1,

                }
            },
            {
                $limit: numberLimit
            },
            {
                $skip: numberSkip
            }
        ])
        if (requestList && requestList.length > 0) {
            await createApplicationLog("Delivery", "List of delivery assign request", {}, {}, loginUser?._id)
            return res.status(200).send({ status: 1, message: "Data found successful", data: requestList })
        }
        return res.status(404).send({ status: 0, message: "empty set", data: [] })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}