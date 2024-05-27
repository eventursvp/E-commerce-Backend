const mongoose = require('mongoose')
const User = require('model-hook/Model/userModel')
const { constants } = require("model-hook/common_function/constants")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.updateUserProfile = async (req, res, next) => {
    try {
        const { userId, firstName, lastName, gender } = req.body
        const { loginUser } = req
        if (!userId) {
            return res.status(400).send({ status: 0, message: "User id is required." })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." })
        }
        if (userId != loginUser?._id) {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }

        const obj = {}
        if (firstName) {
            if (!constants.nameRegex.test(firstName) || firstName.length > 20 || firstName.length < 3) {
                return res.status(400).send({ status: 0, message: "Invalid first name." })
            }
            obj.firstName = firstName
        }
        if (lastName) {
            if (!constants.nameRegex.test(lastName) || lastName.length > 20 || lastName.length < 3) {
                return res.status(400).send({ status: 0, message: "Invalid last name." })
            }
            obj.lastName = lastName
        }
        if (gender) {
            if (!['Male', 'Female', 'Other'].includes(gender)) {
                return res.status(400).send({ status: 0, message: "Please select valid gender." })
            }
            obj.gender = gender
        }

        const updateUser = await User.findOneAndUpdate({ _id: userId }, obj, { new: true })
        if (!updateUser) {
            return res.status(500).send({ status: 0, message: "User data not updated." })
        }
        await createApplicationLog(
            "Auth",
            "profile updated",
            {
                firstName: loginUser?.firstName,
                lastName: loginUser?.lastName,
                gender: loginUser?.gender,
            },
            {
                firstName: updateUser?.firstName,
                lastName: updateUser?.lastName,
                gender: updateUser?.gender,
            },
            loginUser?._id)
        return res.status(201).send({ status: 1, message: "User data updated.", data: updateUser })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}