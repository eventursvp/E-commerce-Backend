const mongoose = require('mongoose')
const User = require('model-hook/Model/userModel')

exports.getAllUser = async (req, res, next) => {
    try {
        const { userId } = req.body
        const { loginUser } = req
        if (!userId) {
            return res.status(400).send({ status: 0, message: "User Id is required." })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." })
        }
        if (loginUser?._id != userId || loginUser.role != 'Admin') {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }

        const users = await User.find({ _id: { $ne: userId } })
        if (!users || users.length === 0) {
            return res.status(404).send({ status: 1, message: "Empty set.", data: [] })
        }
        return res.status(200).send({ status: 1, message: "Users found.", data: users })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}