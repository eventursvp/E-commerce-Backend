const mongoose = require('mongoose')
const DeliveryBoy = require("model-hook/Model/deliveryBoyModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.getSingleDeliveryBoy = async (req, res, next) => {
    try {
        const { userId, deliveryBoyId } = req.body
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

        if (!deliveryBoyId) {
            return res.status(400).send({ status: 0, message: "Delivery boy id is required." })
        }
        if (!mongoose.isValidObjectId(deliveryBoyId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." })
        }

        const deliveryBoyData = await DeliveryBoy.findOne({ _id: deliveryBoyId, isLoggedOut: false, emailVerified: true }).populate("vehicleDetails").select("firstName lastName email gender idCard licence vehicleDetails")
        if (!deliveryBoyData) {
            return res.status(404).send({ status: 0, message: "Empty set." })
        }
        await createApplicationLog("Delivery", "get single delivery boy information", {}, {}, loginUser?._id)
        return res.status(200).send({ status: 1, message: "Data found.", data: deliveryBoyData })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}