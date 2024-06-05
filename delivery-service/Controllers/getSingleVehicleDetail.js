const mongoose = require("mongoose")
const VehicleDetails = require("model-hook/Model/vehicleDetailsModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.getSingleVehicleDetail = async (req, res, next) => {
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

        const vehicleDetails = await VehicleDetails.findOne({ _id: vehicleId, deliveryBoyId: deliveryBoyId })

        if (vehicleDetails) {
            await createApplicationLog("Delivery", "get single vehicle details", {}, {}, loginUser._id)
            return res.status(200).send({ status: 1, message: "Vehicle details founded.", data: vehicleDetails })
        }
        return res.status(404).send({ status: 0, message: "Vehicle details not found with given id." })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}