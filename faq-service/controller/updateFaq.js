const Faq = require("model-hook/Model/faqModel");
const Admin = require("model-hook/Model/adminModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.updateFaqQuestion = async (req, res) => {
    try {
        const { questionId, addedBy, faqId ,question,answer} = req.body;

        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        // if (loginUser?.data?.role != 'Admin') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }


        if (!(addedBy && faqId && questionId || question || answer)) {
            return res
                .status(409)
                .send({ status: 0, message: "All fields are required" });
        }

        if (
            !(
                mongoose.Types.ObjectId.isValid(questionId) &&
                mongoose.Types.ObjectId.isValid(addedBy) &&
                mongoose.Types.ObjectId.isValid(faqId)
            )
        ) {
            return res
                .status(403)
                .send({ status: 0, message: "Invalid request" });
        }

        const faqData = await Faq.findOne({
            _id: faqId,
            isDeleted: false,
            addedBy: addedBy,
            faqs: { $elemMatch: { _id: questionId } }

        });

        if (!faqData) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }

        const data = await Faq.findByIdAndUpdate(
            { _id: faqId, addedBy: addedBy, "faqs._id":questionId},
            { $set: { faqs: req.body } },
            { new: true }
        );

        if (data) {
            return res.status(200).send({
                status: 1,
                messae: "Record updated successfully!",
            });
        }
        return res.status(404).send({
            status: 1,
            messae: "Error in  deleting record",
            data: [],
        });
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
};