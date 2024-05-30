const jwt = require("jsonwebtoken");
const DeliveryBoy = require('model-hook/Model/deliveryBoyModel')
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params
        if (!token) {
            return res.status(400).send({ status: 0, message: "Please provide valid token." });
        }
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        if (decoded) {
            const deliveryBoy = await DeliveryBoy.findOne({ email: decoded.email.toLowerCase() })
            if (deliveryBoy) {
                if (deliveryBoy?.emailVerified) {
                    return res.status(200).send({ status: 0, message: 'Email already verified' });

                } else {
                    const updateDeliveryBoyData = await DeliveryBoy.findOneAndUpdate({ email: decoded?.email }, { emailVerified: true }, { new: true })
                    if (!updateDeliveryBoyData) {
                        return res.status(500).send({ status: 0, message: "Email not verified please try again" })
                    }
                    await createApplicationLog("Delivery", "verify email", {}, {}, deliveryBoy?._id)
                    return res.status(200).send({ status: 1, message: "Email verified successfully" });
                }
            } else {
                return res.status(400).send({ status: 0, message: "Delivery boy data not found." });
            }
        }
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}