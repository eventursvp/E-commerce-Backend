const mongoose = require("mongoose")
const ContactUs = require("model-hook/Model/contactUsModel")

exports.removeContactUs = async (req, res, next) => {
    try {
        const { userId, contactUsId } = req.body
        const { loginUser } = req
        if (!userId) {
            return res.status(400).send({ status: 0, message: "User Id is required." })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." });
        }
        if (loginUser?._id != userId || loginUser?.role !== "Admin") {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }
        if (!contactUsId) {
            return res.status(400).send({ status: 0, message: "Contact us id is required." })
        }
        if (!mongoose.isValidObjectId(contactUsId)) {
            return res.status(400).send({ status: 0, message: "Invalid contact us id." })
        }
        const data = await ContactUs.findOne({
            _id: contactUsId,
        })
        if (data) {
            const removeData = await ContactUs.findOneAndDelete({ _id: contactUsId })
            if (removeData) {
                return res.status(200).send({ status: 1, message: "Data removed..", data: data })
            }
            return res.status(400).send({ status: 0, message: "Data not removed, Please try again" })
        }
        return res.status(404).send({ status: 0, message: "Data not found with given id." })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}
