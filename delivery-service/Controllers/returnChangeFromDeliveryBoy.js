const mongoose = require("mongoose")
const GaveChangeToDeliveryBoy = require("model-hook/Model/gaveChangeToDeliveryBoyModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")
const { constants } = require("model-hook/common_function/constants")

exports.returnChangeFromDeliveryBoy = async (req, res, next) => {
    try {
        const { userId, gaveChangeToDeliveryBoyId, amountReturned } = req.body
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

        if (!gaveChangeToDeliveryBoyId) {
            return res.status(400).send({ status: 0, message: "Gave change to delivery boy id is required." })
        }
        if (!mongoose.isValidObjectId(gaveChangeToDeliveryBoyId)) {
            return res.status(400).send({ status: 0, message: "Invalid gave change to delivery boy id" })
        }
        const checkData = await GaveChangeToDeliveryBoy.findOne({ _id: gaveChangeToDeliveryBoyId, userId: userId }).select("deliveryBoyId amountGiven status").lean()
        if (!checkData) {
            return res.status(400).send({ status: 0, message: "Money given data not found with given id." })
        }
        if (checkData?.status === "RETURNED") {
            return res.status(400).send({ status: 0, message: "Money already returned from delivery boy" })
        }

        if (!amountReturned) {
            return res.status(400).send({ status: 0, message: "Amount returned field is required." })
        }
        if (!constants.numberRegex.test(amountReturned) || amountReturned <= 0 || typeof amountReturned !== "number" || amountReturned !== checkData?.amountGiven) {
            return res.status(400).send({ status: 0, message: "Invalid value of amount returned." })
        }

        const result = await GaveChangeToDeliveryBoy.findOneAndUpdate(
            { _id: gaveChangeToDeliveryBoyId, userId: userId },
            { amountReturned: amountReturned, amountReturnedDate: Date.now(), status: "RETURNED" },
            { new: true })

        if (result && result.status === "RETURNED") {
            await createApplicationLog(
                "Delivery",
                "give change to delivery boy",
                { amountReturned: checkData?.amountReturned, amountReturnedDate: checkData?.amountReturnedDate, status: checkData?.status },
                { amountReturned: result?.amountReturned, amountReturnedDate: result?.amountReturnedDate, status: result?.status },
                loginUser?._id
            )
            return res.status(201).send({ status: 1, message: "Change money returned from delivery boy successful.", data: result });
        } else {
            return res.status(500).send({ status: 0, message: "Change money not returned, Please try again." });
        }
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}
