const mongoose = require("mongoose")
const UserAddress = require("model-hook/Model/userAddressModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.getAllAddresses = async (req, res, next) => {
    try {
        const { userId } = req.body
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
        const addressData = await UserAddress.find({ userId: userId })
        if (addressData && addressData.length > 0) {
            const sortedData = addressData.sort((a, b) => {
                if (a.defaultAddress === true && b.defaultAddress === false) {
                    return -1;
                } else if (a.defaultAddress === false && b.defaultAddress === true) {
                    return 1;
                } else {
                    return 0;
                }
            });
            await createApplicationLog("Auth", "get all addresses", [], [], loginUser?._id)
            return res.status(200).send({ status: 1, message: "Addresses founded.", data: sortedData })
        }
        return res.status(404).send({ status: 0, message: "Empty set." })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}