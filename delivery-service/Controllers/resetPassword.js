const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const DeliveryBoy = require("model-hook/Model/deliveryBoyModel")
const hashPassword = require("model-hook/common_function/hashPassword");
const BlockListToken = require("model-hook/Model/blockListTokenModel");
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.resetPassword = async (req, res, next) => {
    try {
        const { password } = req.body
        const { token } = req.params
        if (!token || !password) {
            return res.status(400).send({ status: 0, message: 'Token and password is required' });
        }
        const checkToken = await BlockListToken.findOne({ token: token });
        if (checkToken) {
            return res.status(400).send({ status: 0, message: 'Token is expired.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        if (decoded) {
            const deliveryBoyData = await DeliveryBoy.findOne({ email: decoded.email.toLowerCase() })
            if (deliveryBoyData) {
                if (deliveryBoyData.password) {
                    const isSamePassword = await bcrypt.compare(password, deliveryBoyData?.password);
                    if (isSamePassword) {
                        return res.status(500).send({ status: 0, message: 'Your new password should not be same as your current password.' });
                    }
                }
                const passwordHash = await hashPassword(password);
                const resetPassword = await DeliveryBoy.findByIdAndUpdate(deliveryBoyData?.id, { password: passwordHash }, { new: true });
                if (resetPassword) {
                    const blockListToken = await BlockListToken.create({ token: token, userId: deliveryBoyData._id });
                    await createApplicationLog("Delivery", "reset password", {}, {}, deliveryBoyData?._id)
                    return res.status(201).send({ status: 1, message: 'Password reset successfully' });
                }
                return res.status(500).send({ status: 0, message: 'Password not reset please try again' });
            }

        } else {
            return res.status(400).send({ status: 0, message: 'Delivery boy data Not found' });
        }

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).json({ status: 0, message: 'User Not found' });
    }
}