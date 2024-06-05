const mongoose = require("mongoose")
const CodCashReceived = require("model-hook/Model/codCashReceivedModel")
const CodCollectedPayments = require("model-hook/Model/codCollectedPaymentsModel")
const DeliveryBoy = require("model-hook/Model/deliveryBoyModel")
const Orders = require("model-hook/Model/orderModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")
const { constants } = require("model-hook/common_function/constants")

exports.collectDeliveryPaymentFromDeliveryBoy = async (req, res, next) => {
    try {
        const { userId, deliveryBoyId, orderId, amountCollected, remarks } = req.body
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
        const checkOrder = await Orders.findById({ _id: orderId }).lean()
        if (!checkOrder) {
            return res.status(404).send({ status: 0, message: "Order not found with given id." })
        }
        if (checkOrder?.orderStatus !== "DELIVERED") {
            return res.status(400).send({ status: 0, message: "This order is not delivered" })
        }
        if (checkOrder?.paymentMode !== "COD") {
            return res.status(400).send({ status: 0, message: "This order's payment type is not COD." })
        }

        if (!deliveryBoyId) {
            return res.status(400).send({ status: 0, message: "Delivery boy id is required." })
        }
        if (!mongoose.isValidObjectId(deliveryBoyId || checkOrder?.deliveryBoyId !== deliveryBoyId)) {
            return res.status(400).send({ status: 0, message: "Invalid delivery boy id." })
        }
        const checkDeliveryBoy = await DeliveryBoy.findOne({ _id: deliveryBoyId, emailVerified: true }).lean()
        if (!checkDeliveryBoy) {
            return res.status(404).send({ status: 0, message: "Delivery boy not found with given id." })
        }

        if (!amountCollected) {
            return res.status(400).send({ status: 0, message: "Amount Collected field is required." })
        }
        if (!constants.numberRegex.test(amountCollected) || amountCollected <= 0 || amountCollected !== checkOrder?.price) {
            return res.status(400).send({ status: 0, message: "Invalid value of amount collected field." })
        }

        if (remarks) {
            if (!constants.searchPattern.test(remarks)) {
                return res.status(400).send({ status: 0, message: "Invalid remarks value." })
            }
            if (remarks.length > 100) {
                return res.status(400).send({ status: 0, message: "Maximum 100 character allow into remarks." })
            }
        }

        const checkAlreadyCollectPayment = await CodCollectedPayments.findOne({ orderId: orderId, deliveryBoyId: deliveryBoyId })
        if (checkAlreadyCollectPayment) {
            return res.status(400).send({ status: 0, message: "This order's payment is already collected" })
        }

        const result = await CodCollectedPayments.create({
            deliveryBoyId: deliveryBoyId,
            orderId: orderId,
            amountCollected: amountCollected,
            remarks: remarks || "",
            userId: userId
        })

        if (result) {
            await createApplicationLog("Delivery", "payment collected from delivery boy", {}, {}, loginUser?._id)
            return res.status(201).send({ status: 1, message: "Payment collected from delivery boy", data: result })
        } else {
            return res.status(500).send({ status: 0, message: "The collected payment entry was not created." })
        }

    } catch {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}