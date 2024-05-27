const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Users = require("model-hook/Model/userModel")
const hashPassword = require("model-hook/common_function/hashPassword");
const { constants } = require("model-hook/common_function/constants")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.changePassword = async (req, res) => {
    try {
        const { userId, oldPassword, newPassword, confirmPassword } = req.body;
        const { loginUser } = req
        if (!userId) {
            return res.status(400).send({ status: 0, message: "User Id is required" });
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." });
        }
        if (loginUser?._id != userId) {
            return res.status(403).send({ status: 0, message: "Unauthorized Access." });
        }
        if (!oldPassword) {
            return res.status(400).send({ status: 0, message: "Old password is required." })
        }
        const validPassword = await bcrypt.compareSync(oldPassword, loginUser.password);
        if (!validPassword) {
            return res.status(400).send({ status: 0, message: 'Your old password does not match.' });
        }
        if (!newPassword) {
            return res.status(400).send({ status: 0, message: "new password is required." })
        }
        if (!confirmPassword) {
            return res.status(400).send({ status: 0, message: "Confirm password is required." })
        }
        if (newPassword.length < 8) {
            return res.status(400).send({ status: 0, message: "Password must be at least 8 characters." })
        }
        if (newPassword.length > 25) {
            return res.status(400).send({ status: 0, message: "Password must be less than 25 characters." })
        }
        if (!constants.passwordRegex.test(newPassword)) {
            return res.status(400).send({ status: 0, message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." })
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).send({ status: 0, message: "New password and confirm password not match." })
        }

        if (validPassword) {
            const isSamePassword = await bcrypt.compareSync(newPassword, loginUser?.password);
            if (isSamePassword) {
                return res.status(500).send({ status: 0, message: 'Your new password should not be same as your current password.' });
            }
            const hashedPassword = await hashPassword(newPassword);
            const result = await Users.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
            if (!result) {
                return res.status(500).send({ status: 0, message: "Password not changed please try again." })
            }
            await createApplicationLog("Auth", "change password", {}, {}, loginUser?._id)
            return res.status(201).send({ status: 1, message: "Your password changed." })
        }

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}