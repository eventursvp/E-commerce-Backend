const mongoose = require("mongoose")
const VehicleDetails = require("model-hook/Model/vehicleDetails")
const { constants } = require("model-hook/common_function/constants")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.updateVehicleDetails = async (req, res, next) => {
    try {
        const { deliveryBoyId, vehicleId, vehicleNumber, owner } = req.body
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

        let updateObj = {}
        if (checkVehicleDetails.vehicleNumber !== vehicleNumber) {
            if (checkVehicleDetails.updateOnce === true) {
                return res.status(400).send({ status: 0, message: "Vehicle number is update once time." })
            }
            if (!constants.numberPlateRegex.test(vehicleNumber)) {
                return res.status(400).send({ status: 0, message: "Invalid number plate." })
            }
            const checkVehicleNumber = await VehicleDetails.findOne({ vehicleNumber: vehicleNumber })

            if (checkVehicleNumber) {
                return res.status(400).send({ status: 0, message: "This vehicle number is already used, Please try another." })
            }
            updateObj = {
                ...updateObj,
                updateOnce: true,
                vehicleNumber: vehicleNumber
            }
        }
        if (owner) {
            if (!constants.nameRegex.test(owner)) {
                return res.status(400).send({ status: 0, message: "Invalid owner name." })
            }
            if (owner.length > 40 || owner.length < 3) {
                return res.status(400).send({ status: 0, message: "Owner name must be have minimum 2 or maximum 40 character." })
            }
            updateObj = {
                ...updateObj,
                owner: owner
            }
        }

        const updateData = await VehicleDetails.findOneAndUpdate({ _id: vehicleId, deliveryBoyId: deliveryBoyId }, updateObj, { new: true })
        if (updateData) {
            await createApplicationLog(
                "Delivery",
                "update vehicle details",
                {
                    vehicleNumber: checkVehicleDetails?.vehicleNumber,
                    owner: checkVehicleDetails?.owner
                },
                {
                    vehicleNumber: updateData?.vehicleNumber,
                    owner: updateData?.owner
                },
                loginUser?._id)
            return res.status(201).send({ status: 1, message: "Vehicle details updated.", data: updateData })
        }
        return res.status(500).send({ status: 0, message: "Your vehicle details not updated, Please try again." })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}