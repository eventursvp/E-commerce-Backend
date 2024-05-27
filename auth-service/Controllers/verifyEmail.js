const jwt = require("jsonwebtoken");
const User = require('model-hook/Model/userModel')
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params
        if (!token) {
            return res.status(400).send({ status: 0, message: "Please provide valid token." });
        }
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        if (decoded) {
            const user = await User.findOne({ email: decoded.email.toLowerCase() })
            if (user) {
                if (user?.emailVerified) {
                    return res.status(200).send({ status: 0, message: 'Email already verified' });

                } else {
                    const updateUser = await User.findOneAndUpdate({ email: decoded.email }, { emailVerified: true }, { new: true })
                    if (!updateUser) {
                        return res.status(500).send({ status: 0, message: "Email not verified please try again" })
                    }
                    await createApplicationLog("Auth", "verify email", {}, {}, user?._id)
                    return res.status(200).send({ status: 1, message: "Email verified successfully" });
                }
            } else {
                return res.status(400).send({ status: 0, message: "User not found." });
            }
        }
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}