const mongoose = require('mongoose')
const DeliveryBoy = require("model-hook/Model/deliveryBoyModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.deactiveDeliveryBoy = async (req, res, next) => {
    try {
        const { userId, deliveryBoyId } = req.body
        const { loginUser } = req
        if (!userId) {
            return res.status(400).send({ status: 0, message: "User id is required." })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." })
        }
        if (loginUser?._id != userId || loginUser.role != 'Admin') {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }

        if (!deliveryBoyId) {
            return res.status(400).send({ status: 0, message: "Delivery boy id is required." })
        }
        if (!mongoose.isValidObjectId(deliveryBoyId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." })
        }

        const deliveryBoyData = await DeliveryBoy.findOne({ _id: deliveryBoyId, isLoggedOut: false, emailVerified: true })
        if (!deliveryBoyData) {
            return res.status(404).send({ status: 0, message: "Delivery boy data not found with given id." })
        }

        if (deliveryBoyData?.isDeactive === true) {
            const activeAccount = await DeliveryBoy.findOneAndUpdate({ _id: deliveryBoyId, isLoggedOut: false, emailVerified: true }, { isDeactive: false }, { new: true })
            if (activeAccount.isDeactive === false) {
                await createApplicationLog(
                    "Delivery",
                    "active account",
                    { isDeactive: deliveryBoyData?.isDeactive },
                    { isDeactive: activeAccount?.isDeactive },
                    loginUser?._id)
                return res.status(201).send({ status: 1, message: "Account active successfully done", data: activeAccount })
            }
            return res.status(500).send({ status: 0, message: "Account not active, Please try again." })

        } else if (deliveryBoyData?.isDeactive === false) {
            const deactiveAccount = await DeliveryBoy.findOneAndUpdate({ _id: deliveryBoyId, isLoggedOut: false, emailVerified: true }, { isDeactive: true }, { new: true })
            if (deactiveAccount?.isDeactive === true) {
                await createApplicationLog(
                    "Delivery",
                    "deactive account",
                    { isDeactive: deliveryBoyData?.isDeactive },
                    { isDeactive: deactiveAccount?.isDeactive },
                    loginUser?._id)
                return res.status(201).send({ status: 1, message: "Account deactive successfully done", data: deactiveAccount })
            }
            return res.status(500).send({ status: 0, message: "Account not deactive, Please try again." })
        }
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}