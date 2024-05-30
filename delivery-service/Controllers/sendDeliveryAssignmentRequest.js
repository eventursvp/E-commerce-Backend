const mongoose = require("mongoose")
const DeliveryAssignmentRequest = require("model-hook/Model/deliveryAssignmentRequest")
const DeliveryBoy = require("model-hook/Model/deliveryBoyModel")
const Orders = require("model-hook/Model/orderModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.sendDeliveryAssignmentRequest = async (req, res, next) => {
    try {
        const { userId, orderId, deliveryBoyId } = req.body
        const { loginUser } = req
        if (!userId) {
            return res.status(400).send({ status: 0, message: "User id is required." })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." })
        }
        if (loginUser?._id != userId || loginUser.role != 'Admin') {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }

        if (!orderId) {
            return res.status(400).send({ status: 0, message: "Order id is required." })
        }
        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(400).send({ status: 0, message: "Invalid order id." })
        }
        const checkOrder = await Orders.findOne({ _id: orderId }).populate("deliveryBoyId")
        if (!checkOrder) {
            return res.status(404).send({ status: 0, message: "Order not found with given id." })
        }
        if (checkOrder?.status !== "PACKED") {
            return res.status(400).send({ status: 0, message: "You can assign order if order is PACKED." })
        }
        if (checkOrder.deliveryBoyId) {
            return res.status(400).send({ status: 0, message: `This order delivery is already accept by ${checkOrder?.deliveryBoyId?.firstName} ${checkOrder?.deliveryBoyId?.lastName}` })
        }

        const checkAlreadyAssign = await DeliveryAssignmentRequest.findOne({ orderId: orderId, deliveryBoyId: deliveryBoyId })
        if (checkAlreadyAssign) {
            return res.status(400).send({ status: 0, message: "You have already sent a delivery request to this delivery boy." })
        }

        if (!deliveryBoyId) {
            return res.status(400).send({ status: 0, message: "Delivery boy id is required." })
        }
        if (!mongoose.isValidObjectId(deliveryBoyId)) {
            return res.status(400).send({ status: 0, message: "Invalid delivery boy id." })
        }
        const checkDeliveryBoy = await DeliveryBoy.find({ _id: deliveryBoyId, isLoggedOut: false, phoneVerified: true })
        if (!checkDeliveryBoy) {
            return res.status(404).send({ status: 0, message: "Delivery boy not found with given id." })
        }
        if (checkDeliveryBoy.isDeactive) {
            return res.status(400).send({ status: 0, message: "Please active this delivery boy to assign delivery." })
        }

        const assignOrderRequest = await DeliveryAssignmentRequest.create({
            orderId: orderId,
            deliveryBoyId: deliveryBoyId,
            status: "PENDING",
            userId: userId
        })

        if (assignOrderRequest) {
            await createApplicationLog("Delivery", "send delivery assignment request", {}, {}, loginUser?._id)
            return res.status(201).send({ status: 1, message: "Delivery assign request send successfully.", data: assignOrderRequest })
        }
        return res.status(500).send({ status: 0, message: "Delivery assign request not send, Please try again." })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}