const User = require('model-hook/Model/userModel')

exports.deactiveUser = async (req, res, next) => {
    try {
        // const { userId } = req.body
        // const { loginUser } = req
        // if (!userId) {
        //     return res.send({ status: 0, message: "User Id is required." })
        // }
        // if (loginUser?.data?._id != userId) {
        //     return res.send({ status: 0, message: "Unauthorized access." })
        // }
        // const user = await User.findOne({ _id: userId })
        // if (!user) {
        //     return res.send({ status: 0, message: "User not found." })
        // }
        // const removeUser = await User.findOneAndRemove({ _id: userId })

        // if (!removeUser && !removePhoneLogin) {
        //     return res.send({ status: 0, message: "User not deactivate" })
        // }

        // return res.send({ status: 1, message: "User deactivated successfull.", data: removeUser })
        return res.send({ data: "hello from deactive api." })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}