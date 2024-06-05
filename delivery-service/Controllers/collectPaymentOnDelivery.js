const mongoose = require("mongoose")
const DeliveryAssignmentRequest = require("model-hook/Model/deliveryAssignmentRequestModel")
const CodCashReceived = require("model-hook/Model/codCashReceivedModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")
const { constants } = require("model-hook/common_function/constants")

exports.collectPaymentOnDelivery = async (req, res, next) => {
    try {
        const { deliveryAssignmentRequestId, deliveryBoyId, paymentMethod, paymentAmount, tip = 0 } = req.body
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

        if (!deliveryAssignmentRequestId) {
            return res.status(400).send({ status: 0, message: "Delivery assignment id is required." })
        }
        if (!mongoose.isValidObjectId(deliveryAssignmentRequestId)) {
            return res.status(400).send({ status: 0, message: "Invalid delivery assignment request id." })
        }

        const deliveryAssignmentData = await DeliveryAssignmentRequest.findOne({ _id: deliveryAssignmentRequestId, deliveryBoyId: deliveryBoyId, status: "ACCEPTED" }).populate("orderId")
        if (!deliveryAssignmentData) {
            return res.status(404).send({ status: 0, message: "Delivery assignment requested data not found with given id." })
        }
        if (!paymentMethod) {
            return res.status(400).send({ status: 0, message: "Payment method is required." })
        }
        if (!['ONLINE', 'CASH'].includes(paymentMethod)) {
            return res.status(400).send({ status: 0, message: "Invalid payment method." })
        }
        if (paymentMethod === "CASH") {
            const checkPreviousReceived = await CodCashReceived.findOne({ orderId: deliveryAssignmentData?.orderId?._id })
            if (checkPreviousReceived) {
                return res.status(400).send({ status: 0, message: "Payment already received." })
            }
        }
        if (paymentMethod === "ONLINE") {
            // check from online payment entry collection that payment is received or not
        }

        if (tip) {
            if (!constants.numberRegex.test(tip) || tip < 0) {
                return res.status(400).send({ status: 0, message: "Invalid tip amount." })
            }
        }

        if (!paymentAmount) {
            return res.status(400).send({ status: 0, message: "Payment amount is required." })
        }

        if (typeof paymentAmount !== "number" || !constants.numberRegex.test(paymentAmount) || paymentAmount - tip != deliveryAssignmentData?.orderId?.price || paymentAmount !== deliveryAssignmentData?.orderId?.price + tip) {
            return res.status(400).send({ status: 0, message: "Invalid payment amount." })
        }

        const orderId = deliveryAssignmentData?.orderId?._id
        if (!orderId) {
            return res.status(400).send({ status: 0, message: "Order id not found from delivery assignment request data." })
        }
        const customerId = deliveryAssignmentData?.orderId?.addedBy
        if (!customerId) {
            return res.status(400).send({ status: 0, message: "Customer id not found from delivery assignment request data." })
        }

        const result = await CodCashReceived.create({
            orderId: orderId,
            customerId: customerId,
            paymentMethod: paymentMethod,
            paymentAmount: paymentAmount,
            deliveryBoyId: deliveryBoyId,
            tipAmount: tip
        })
        if (result) {
            await createApplicationLog("Delivery", "collect delivery payment", {}, {}, loginUser?._id)
            return res.status(201).send({ status: 1, message: "Payment collected", data: result })
        }
        return res.status(500).send({ status: 0, message: "Payment not collected, Please try again." })

    } catch {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}