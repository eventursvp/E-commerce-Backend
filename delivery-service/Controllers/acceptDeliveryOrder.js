const mongoose = require("mongoose")
const DeliveryAssignmentRequest = require("model-hook/Model/deliveryAssignmentRequestModel")
const Orders = require("model-hook/Model/orderModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.acceptDeliveryOrder = async (req, res, next) => {
    try {
        const { deliveryBoyId, status, deliveryAssignmentRequestId } = req.body
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

        if (!status) {
            return res.status(400).send({ status: 0, message: "Status is required." })
        }
        if (!["ACCEPTED", "REJECTED"].includes(status)) {
            return res.status(400).send({ status: 0, message: "Invalid status value." })
        }

        if (!deliveryAssignmentRequestId) {
            return res.status(400).send({ status: 0, message: "Delivery assignment request id is required." })
        }
        if (!mongoose.isValidObjectId(deliveryAssignmentRequestId)) {
            return res.status(400).send({ status: 0, message: "Invalid delivery assignment request id." })
        }

        const checkDeliveryAssignRequest = await DeliveryAssignmentRequest.findOne({ _id: deliveryAssignmentRequestId, deliveryBoyId: deliveryBoyId, }).populate("orderId")
        if (!checkDeliveryAssignRequest) {
            return res.status(400).send({ status: 0, message: "Delivery assign data not found with given id." })
        }
        if (checkDeliveryAssignRequest?.orderId?.deliveryBoyId && checkDeliveryAssignRequest?.orderId?.deliveryBoyId != deliveryBoyId) {
            return res.status(400).send({ status: 0, message: "Another delivery boy already accept this delivery" })
        }
        if (checkDeliveryAssignRequest.status === "ACCEPTED") {
            return res.status(400).send({ status: 0, message: "You can not change status after accepted for delivery" })
        }

        checkDeliveryAssignRequest.status = status;
        const updateStatus = await checkDeliveryAssignRequest.save();
        if (["ACCEPTED", "REJECTED"].includes(updateStatus?.status)) {
            if (status === "ACCEPTED") {
                await Orders.findOneAndUpdate({ _id: updateStatus?.orderId?._id }, { deliveryBoyId: deliveryBoyId, orderStatus: "DISPATCHED" }, { new: true })
            }
            await createApplicationLog("Delivery", `delivery boy ${status} delivery`, { status: checkDeliveryAssignRequest.status }, { status: updateStatus.status }, loginUser?._id)
            return res.status(201).send({ status: 1, message: `Delivery ${status} successful.` })
        }
        return res.status(500).send({ status: 0, message: `Delivery not ${status}` })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}