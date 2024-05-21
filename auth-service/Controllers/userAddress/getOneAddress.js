const mongoose = require("mongoose")
const UserAddress = require("model-hook/Model/userAddressModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.getOneAddress = async (req, res, next) => {
    try {
        const { userId, addressId } = req.body
        const { loginUser } = req
        if (!userId) {
            return res.status(400).send({ status: 0, message: "User id is required." })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." })
        }
        if (loginUser?._id != userId) {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }
        if (!addressId) {
            return res.status(400).send({ status: 0, message: "Address id is required." })
        }
        if (!mongoose.isValidObjectId(addressId)) {
            return res.status(400).send({ status: 0, message: "Invalid address id." })
        }

        const addressData = await UserAddress.findOne({ userId: userId, _id: addressId })
        if (addressData) {
            await createApplicationLog("Auth", "get one address", [], [], loginUser?._id)
            return res.status(200).send({ status: 1, message: "Address founded.", data: addressData })
        }
        return res.status(404).send({ status: 0, message: "Address not found with given id" })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}