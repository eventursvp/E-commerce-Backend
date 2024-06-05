const mongoose = require("mongoose")
const DeliveryBoy = require('model-hook/Model/deliveryBoyModel')
const VehicleDetails = require("model-hook/Model/vehicleDetailsModel")
const { constants } = require("model-hook/common_function/constants")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.addVehicle = async (req, res, next) => {
    try {
        const { deliveryBoyId, vehicleType, vehicleNumber, model, owner } = req.body
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

        if (!vehicleType) {
            return res.status(400).send({ status: 0, message: "Vehicle Type is requires." })
        }
        if (!["truck", "bike", "car"].includes(vehicleType)) {
            return res.status(400).send({ status: 0, message: "Only truck, bike and car allow into vehicle type" })
        }
        if (vehicleType?.length > 30) {
            return res.status(400).send({ status: 0, message: "Maximum 30 character allow into vehicle type." })
        }
        if (!vehicleNumber) {
            return res.status(400).send({ status: 0, message: "Vehicle number is required." })
        }
        if (!constants.numberPlateRegex.test(vehicleNumber)) {
            return res.status(400).send({ status: 0, message: "Invalid vehicle number." })
        }
        const checkVehicleNumber = await VehicleDetails.findOne({ vehicleNumber: vehicleNumber })

        if (checkVehicleNumber) {
            return res.status(400).send({ status: 0, message: "This vehicle number is already used, Please try another." })
        }
        if (!model) {
            return res.status(400).send({ status: 0, message: "Model is required." })
        }
        if (!constants?.searchPattern.test(model)) {
            return res.status(400).send({ status: 0, message: "Invalid model value." })
        }
        if (model.length > 30) {
            return res.status(400).send({ status: 0, message: "Maximum 30 character allow into model." })
        }
        if (!owner) {
            return res.status(400).send({ status: 0, message: "Owner name is required." })
        }
        if (!constants.nameRegex.test(owner)) {
            return res.status(400).send({ status: 0, message: "Invalid owner name." })
        }
        if (owner.length > 40 || owner.length < 3) {
            return res.status(400).send({ status: 0, message: "Owner name must be have minimum 2 or maximum 40 character." })
        }
        const createVehicleDetails = await VehicleDetails.create({
            vehicleType,
            vehicleNumber,
            model,
            owner,
            deliveryBoyId: deliveryBoyId
        })
        if (createVehicleDetails) {
            const updateDeliveryBoyData = await DeliveryBoy.findOneAndUpdate({ _id: deliveryBoyId }, { $push: { vehicleDetails: createVehicleDetails?._id } }, { new: true })
            if (!updateDeliveryBoyData) {
                await VehicleDetails.findOneAndDelete({ _id: createVehicleDetails?._id })
                return res.status(500).send({ status: 0, message: "Your vehicle details not added, Please try again." })
            }
            await createApplicationLog("Delivery", "add vehicle", {}, {}, loginUser?._id)
            return res.status(201).send({ status: 1, message: "Vehicle Data added successful. ", data: createVehicleDetails })
        }
        return res.status(500).send({ status: 0, message: "Your vehicle details not added, Please try again." })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}