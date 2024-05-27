const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Users = require('model-hook/Model/userModel')
const { RateLimiterMemory } = require('rate-limiter-flexible');
const otpGenerator = require('otp-generator');
const UserOtp = require('model-hook/Model/userOtpModel')
const { createApplicationLog } = require("model-hook/common_function/createLog")

const opts = {
    points: 5, // 5 points
    duration: 30 * 60, // Per 30 minutes
};
const rateLimiter = new RateLimiterMemory(opts);

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).send({ status: 0, message: "User not found. Please register first." })
        }
        if (!user?.emailVerified) {
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
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ status: 0, message: "Email / Password is invalid" })
        }
        if (user.is2FAEnabled) {
            const otp = this.generateOtp();
            // const otp = "0000"
            const alreadyExist = await UserOtp.findOne({ userId: user._id, phoneNo: user.phoneNo })
            if (alreadyExist) {
                await UserOtp.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(alreadyExist._id) }, { $set: { otp: otp, expirationTime: Date.now() + 30000 } }, { new: true })
            } else {
                await UserOtp.create({ userId: user._id, phoneNo: user.phoneNo, otp: otp, expirationTime: Date.now() + 30000 })
            }
            await createApplicationLog("Auth", "otp send", {}, {}, alreadyExist._id)
            return res.status(201).send({ status: 1, message: "Otp send to your phone, Please verify.", otp })

        }
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_TOKEN, { expiresIn: "1d" });
        user.isLoggedOut = false
        user.save()
        await createApplicationLog("Auth", "user login", {}, {}, user._id)
        return res.status(200).send({ status: 1, message: "Login successfully done", data: user, token: token })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error })
    }
}

exports.generateOtp = () => {
    const otp = parseInt(otpGenerator.generate(4, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false }));
    return otp;
}