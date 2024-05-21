const mongoose = require("mongoose")
const UserAddress = require("model-hook/Model/userAddressModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.setDefaultAddress = async (req, res, next) => {
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
        if (checkAddress?.defaultAddress === true) {
            return res.status(400).send({ status: 0, message: "This address is already set as a default address." })
        }
        if (checkAddress) {
            const changeOtherDefault = await UserAddress.updateMany(
                { userId: (userId) },
                { $set: { defaultAddress: false } }
            );

            const setDefaultAddress = await UserAddress.findByIdAndUpdate(
                { userId: (userId), _id: addressId },
                { $set: { defaultAddress: true } }
                , { new: true });
            if (setDefaultAddress || setDefaultAddress?.modifiedCount > 0) {
                await createApplicationLog(
                    "Auth",
                    "default address set",
                    [{
                        defaultAddress: checkAddress?.defaultAddress
                    }],
                    [{
                        defaultAddress: setDefaultAddress?.defaultAddress
                    }],
                    loginUser?._id)
                return res.status(200).send({ status: 1, message: "Default address set successfully." })
            }
            return res.status(400).send({ status: 0, message: "Default address not set, Please try again." })
        }

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}