const mongoose = require("mongoose")
const DeliveryBoy = require("model-hook/Model/deliveryBoyModel")
const DeliveryBoyFeedback = require("model-hook/Model/deliveryBoyFeedback");
const { constants } = require("model-hook/common_function/constants")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.getSingleFeedbackOfDeliveryBoy = async (req, res, next) => {
    try {
        const { userId, deliveryBoyFeedbackId } = req.body;
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

        if (!deliveryBoyFeedbackId) {
            return res.status(400).send({ status: 0, message: "Delivery boy feedback id is required." })
        }
        if (!mongoose.isValidObjectId(deliveryBoyFeedbackId)) {
            return res.status(400).send({ status: 0, message: "Invalid delivery boy feedback id." })
        }

        const feedBackData = await DeliveryBoyFeedback.findOne({ _id: deliveryBoyFeedbackId })
            .populate({
                path: 'userId',
                select: 'firstName lastName email'
            })
            .populate({
                path: 'deliveryBoyId',
                select: 'firstName lastName email'
            })
        if (feedBackData) {
            await createApplicationLog("Delivery", "get Single feedback of delivery boy", {}, {}, loginUser?._id)
            return res.status(201).send({ status: 1, message: "Feedback get successful", data: feedBackData })
        } else {
            return res.status(404).send({ status: 0, message: "Feedback of delivery boy is not found with given id." })
        }

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}