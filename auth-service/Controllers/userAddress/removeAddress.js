const mongoose = require("mongoose")
const UserAddress = require("model-hook/Model/userAddressModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.removeAddress = async (req, res, next) => {
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

        const checkAddress = await UserAddress.findOne({ _id: addressId, userId: userId })
        if (!checkAddress) {
            return res.status(404).send({ status: 0, message: "Address not found with given id" })
        }

        const addressData = await UserAddress.findByIdAndRemove({ userId: userId, _id: addressId })
        if (addressData || addressData.deletedCount > 0) {
            await createApplicationLog("Auth", "address removed", [], [], loginUser?._id)
            return res.status(200).send({ status: 1, message: "Address removed.", data: addressData })
        }
        return res.status(500).send({ status: 0, message: "Address not removed, Please try again." })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}