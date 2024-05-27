const User = require('model-hook/Model/userModel')
const mongoose = require('mongoose')
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.logOutUser = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const { loginUser } = req;
        if (!userId) {
            return res.send({ status: 0, message: "User id is required." })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.send({ status: 0, message: "Invalid user id." })
        }
        if (userId != loginUser?._id) {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }
        const user = await User.findOneAndUpdate({ _id: loginUser._id }, { isLoggedOut: true }, { new: true })
        if (!user) {
            return res.status(404).send({ status: 0, message: "User not logout. Please try again." })
        }
        await createApplicationLog("Auth", "log out user", {}, {}, loginUser?._id)
        return res.status(200).send({ status: 1, message: "User logout successfully." })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}