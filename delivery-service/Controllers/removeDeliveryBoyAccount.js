const mongoose = require("mongoose")
const DeliveryBoy = require("model-hook/Model/deliveryBoyModel")
const VehicleDetails = require("model-hook/Model/vehicleDetails")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.removeDeliveryBoyAccount = async (req, res, next) => {
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

        const deliveryBoyData = await DeliveryBoy.findOne({ _id: deliveryBoyId, isLoggedOut: false, emailVerified: true })
        if (!deliveryBoyData) {
            return res.status(404).send({ status: 0, message: "Data not found with given id." })
        }

        const removeDeliveryBoyAccount = await DeliveryBoy.findOneAndDelete({ _id: deliveryBoyId });
        if (removeDeliveryBoyAccount) {
            const removeVehicleDetails = await VehicleDetails.deleteMany({ deliveryBoyId: loginUser?._id })
            await createApplicationLog("Delivery", "remove account", {}, {}, loginUser?._id)
            return res.status(200).send({ status: 1, message: "Delivery boy data removed successfully.", data: removeDeliveryBoyAccount })
        }
        return res.status(500).send({ status: 0, message: "Delivery boy data not removed.." })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}