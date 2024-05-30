const mongoose = require("mongoose")
const DeliveryBoy = require("model-hook/Model/deliveryBoyModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.logoutDeliveryBoy = async (req, res, next) => {
    try {
        const { deliveryBoyId } = req.body
        const { loginUser } = req

        if (!deliveryBoyId) {
            return res.status(400).send({ status: 0, message: "Delivery boy id is required." })
        }
        if (!mongoose.isValidObjectId(deliveryBoyId)) {
            return res.status(400).send({ status: 0, message: "Invalid delivery boy id." })
        }
        if (deliveryBoyId != loginUser?._id || loginUser?.role !== "DeliveryBoy") {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }

        const deliveryBoyData = await DeliveryBoy.findOne({ _id: deliveryBoyId, isLoggedOut: false })
        if (!deliveryBoyData) {
            return res.status(404).send({ status: 0, message: "Data not found with given id." })
        }

        const updateData = await DeliveryBoy.findOneAndUpdate({ _id: loginUser?._id }, { isLoggedOut: true }, { new: truck }).select("-password -role -emailVerified -phoneVerified -isDeactive")
        if (updateData?.isLoggedOut === true) {
            await createApplicationLog(
                "Delivery",
                "logout account",
                { isLoggedOut: deliveryBoyData?.isLoggedOut },
                { isLoggedOut: updateData?.isLoggedOut },
                loginUser?._id)
            return res.status(201).send({ status: 1, message: "Delivery boy logged out successfully.", data: updateData })
        }
        return res.status(500).send({ status: 0, message: "Delivery boy not logged out, Please try again." })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}