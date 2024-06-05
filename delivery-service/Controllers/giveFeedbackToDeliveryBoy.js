const mongoose = require("mongoose")
const Orders = require("model-hook/Model/orderModel")
const DeliveryBoyFeedback = require("model-hook/Model/deliveryBoyFeedback");
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.giveFeedbackToDeliveryBoy = async (req, res, next) => {
    try {
        const { userId, orderId, rating, comment } = req.body;
        const { loginUser } = req
        if (!userId) {
            return res.status(400).send({ status: 0, message: "User id is required." })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." })
        }
        if (loginUser?._id != userId || loginUser.role != 'User') {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }

        if (!orderId) {
            return res.status(400).send({ status: 0, message: "Order id is required." })
        }
        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(400).send({ status: 0, message: "Invalid order id." })
        }
        const checkOrderData = await Orders.findOne({ _id: orderId, addedBy: userId })
        if (!checkOrderData) {
            return res.status(400).send({ status: 0, message: "Order data not found with given id." })
        }
        if (checkOrderData?.orderStatus !== "DELIVERED") {
            return res.status(400).send({ status: 0, message: "Feedback is only give after product is delivered." })
        }
        const deliveryBoyId = checkOrderData?.deliveryBoyId
        if (!deliveryBoyId) {
            return res.status(400).send({ status: 0, message: "Delivery boy not specified into your order." })
        }

        const checkAlreadyGiven = await DeliveryBoyFeedback.findOne({ userId: userId, orderId: orderId, deliveryBoyId: deliveryBoyId })
        if (checkAlreadyGiven) {
            return res.status(400).send({ status: 0, message: "Feedback has already been given to this delivery boy for this order." })
        }

        if (!rating) {
            return res.status(400).send({ status: 0, message: "Rating is required." })
        }
        if (![1, 2, 3, 4, 5].includes(rating) || typeof (rating) !== 'number') {
            return res.status(400).send({ status: 0, message: "Invalid Rating value." })
        }

        if (comment && comment.length > 200) {
            return res.status(400).send({ status: 0, message: "Maximum 200 character allow into comment." })
        }

        const addFeedback = await DeliveryBoyFeedback.create({
            deliveryBoyId: deliveryBoyId,
            userId: userId,
            orderId: orderId,
            rating: rating,
            comment: comment || ""
        })
        if (addFeedback) {
            await createApplicationLog("Delivery", "give feedback to delivery boy", {}, {}, loginUser?._id)
            return res.status(201).send({ status: 1, message: "Feedback added successful", data: addFeedback })
        } else {
            return res.status(500).send({ status: 0, message: "Feedback not add, Please try again." })
        }


    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}