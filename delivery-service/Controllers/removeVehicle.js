const mongoose = require("mongoose")
const DeliveryBoy = require("model-hook/Model/deliveryBoyModel")
const VehicleDetails = require("model-hook/Model/vehicleDetailsModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.removeVehicle = async (req, res, next) => {
    try {
        const { deliveryBoyId, vehicleId } = req.body
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

        if (!vehicleId) {
            return res.status(400).send({ status: 0, message: "Vehicle id is required." })
        }
        if (!mongoose.isValidObjectId(vehicleId)) {
            return res.status(400).send({ status: 0, message: "Invalid vehicle id." })
        }
        const checkVehicleDetails = await VehicleDetails.findOne({ _id: vehicleId, deliveryBoyId: deliveryBoyId })
        if (!checkVehicleDetails) {
            return res.status(404).send({ status: 0, message: "Vehicle details not found with given id." })
        }

        if (loginUser?.vehicleDetails?.length <= 1) {
            return res.status(400).send({ status: 0, message: "You can not remove all vehicle." })
        }

        const removeVehicle = await VehicleDetails.findOneAndDelete({ _id: vehicleId, deliveryBoyId: deliveryBoyId })

        if (removeVehicle) {
            await createApplicationLog("Delivery", "remove vehicle", { ...removeVehicle }, {}, loginUser?._id)
            const removeFromDeliveryBoy = await DeliveryBoy.findOneAndUpdate({ _id: deliveryBoyId }, { $pull: { vehicleDetails: vehicleId } }, { new: true })
            return res.status(200).send({ status: 1, message: "Vehicle details removed.", data: removeVehicle })
        }
        return res.status(500).send({ status: 0, message: "Vehicle details not removed, Please try again." })


    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}