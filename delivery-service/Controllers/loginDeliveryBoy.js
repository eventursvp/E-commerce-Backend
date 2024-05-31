const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const DeliveryBoy = require('model-hook/Model/deliveryBoyModel')
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { createApplicationLog } = require("model-hook/common_function/createLog")

const opts = {
    points: 5, // 5 points
    duration: 30 * 60, // Per 30 minutes
};
const rateLimiter = new RateLimiterMemory(opts);

exports.loginDeliveryBoy = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const deliveryBoyData = await DeliveryBoy.findOne({ email: email.toLowerCase() });
        if (!deliveryBoyData) {
            return res.status(400).send({ status: 0, message: "Email / Password is invalid." })
        }
        if (!deliveryBoyData?.emailVerified) {
            return res.status(400).send({ status: 0, message: "Please verify your email first." })
        }
        const rateLimiterKey = `${req.ip}_${email}`;
        try {
            await rateLimiter.consume(rateLimiterKey);
        } catch (rateLimitError) {
            const retryAfterSeconds = Math.ceil(rateLimitError.msBeforeNext / 1000);
            const minutes = retryAfterSeconds / 60;
            return res.status(429).send({
                status: 0,
                message: `Too many requests, please try again after ${Math.ceil(minutes)} minute.`,
            });
        }
        if (deliveryBoyData?.isDeactive === true) {
            return res.status(400).send({ status: 0, message: "Admin deactive your account, you can login after admin active your account." })
        }
        const isMatch = await bcrypt.compare(password, deliveryBoyData.password);
        if (!isMatch) {
            return res.status(400).send({ status: 0, message: "Email / Password is invalid" })
        }
        const token = jwt.sign({ id: deliveryBoyData._id, email: deliveryBoyData.email, role: deliveryBoyData.role }, process.env.JWT_TOKEN, { expiresIn: "1d" });
        deliveryBoyData.isLoggedOut = false
        await deliveryBoyData.save()
        await createApplicationLog("Delivery", "delivery boy login", {}, {}, deliveryBoyData?._id)
        return res.status(200).send({ status: 1, message: "Login successfully done", data: deliveryBoyData, token: token })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error })
    }
}