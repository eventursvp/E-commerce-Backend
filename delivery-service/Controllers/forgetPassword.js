const jwt = require("jsonwebtoken")
const DeliveryBoy = require("model-hook/Model/deliveryBoyModel")
const { compileAndSendEmail } = require("model-hook/common_function/mailSending")
const { constants, disposableEmailProviders } = require("model-hook/common_function/constants")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body
        // const host_url = req.get("Origin");
        const host_url = "http://192.168.1.16:5022";

        if (!email) {
            return res.status(400).send({ status: 0, message: "Email is required" });
        }
        if (!constants.emailRegex.test(email) /*|| disposableEmailProviders.includes(email.split("@")[1])*/) {
            return res.status(400).send({ status: 0, message: "Invalid email." })
        }
        const deliveryBoyData = await DeliveryBoy.findOne({ email: email.toLowerCase() });
        if (deliveryBoyData?.emailVerified === false) {
            return res.status(400).send({ status: 0, message: "Please complete the signup process." });
        } else if (deliveryBoyData) {
            const token = jwt.sign({ email }, process.env.JWT_TOKEN, { expiresIn: "2h", });
            await this.sendForgetPasswordEmail(email, host_url, token)
            await createApplicationLog("Delivery", "forget password", {}, {}, deliveryBoyData?._id)
            return res.status(200).send({ status: 1, message: 'Password reset link sent successfully.' });
        } else {
            return res.status(400).send({ message: "Please complete sign up process." })
        }

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}

exports.sendForgetPasswordEmail = (receiver, hostUrl, token) => {
    const url = `${hostUrl}/delivery/resetPassword/${token}`
    const templateName = "passwordResetRequest"
    const content = {
        link: url,
    }
    const subject = 'Reset password'
    compileAndSendEmail(templateName, receiver, content, subject)
}