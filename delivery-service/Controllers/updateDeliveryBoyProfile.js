const mongoose = require('mongoose')
const DeliveryBoy = require("model-hook/Model/deliveryBoyModel")
const { constants } = require("model-hook/common_function/constants")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.updateDeliveryBoyProfile = async (req, res, next) => {
    try {
        const { deliveryBoyId, firstName, lastName, gender } = req.body
        const idCard = req?.files?.idCard
        const licence = req?.files?.licence
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

        const obj = {}
        if (firstName) {
            if (!constants.nameRegex.test(firstName) || firstName.length > 20 || firstName.length < 3) {
                return res.status(400).send({ status: 0, message: "Invalid first name." })
            }
            obj.firstName = firstName
        }
        if (lastName) {
            if (!constants.nameRegex.test(lastName) || lastName.length > 20 || lastName.length < 3) {
                return res.status(400).send({ status: 0, message: "Invalid last name." })
            }
            obj.lastName = lastName
        }
        if (gender) {
            if (!['Male', 'Female', 'Other'].includes(gender)) {
                return res.status(400).send({ status: 0, message: "Please select valid gender." })
            }
            obj.gender = gender
        }
        if (idCard && idCard.length > 0) {
            const idCardUrls = await idCard.map((data) => {
                return `http://192.168.1.16:5022/upload/${data?.filename}`
            })
            obj.idCard = idCardUrls
        }
        if (licence && licence?.length > 0) {
            const licenceUrls = await licence.map((data) => {
                return `http://192.168.1.16:5022/upload/${data?.filename}`
            })
            obj.licence = licenceUrls
        }

        const updateDeliveryBoyData = await DeliveryBoy.findOneAndUpdate({ _id: deliveryBoyId }, obj, { new: true }).populate("vehicleDetails").select("firstName lastName email gender role vehicleDetails idCard licence ")
        if (!updateDeliveryBoyData) {
            return res.status(500).send({ status: 0, message: "Delivery boy data not updated, Please try again." })
        }
        await createApplicationLog(
            "Delivery",
            "profile updated",
            {
                firstName: loginUser?.firstName,
                lastName: loginUser?.lastName,
                gender: loginUser?.gender,
                idCard: loginUser?.idCard,
                licence: loginUser?.licence

            },
            {
                firstName: updateDeliveryBoyData?.firstName,
                lastName: updateDeliveryBoyData?.lastName,
                gender: updateDeliveryBoyData?.gender,
                idCard: updateDeliveryBoyData?.idCard,
                licence: updateDeliveryBoyData?.licence

            },
            loginUser?._id)
        return res.status(201).send({ status: 1, message: "Data updated.", data: updateDeliveryBoyData })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}