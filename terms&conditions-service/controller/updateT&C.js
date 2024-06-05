const TermsAndConditions = require("model-hook/Model/terms&Conditions");
const Admin = require("model-hook/Model/adminModel");
const mongoose = require('mongoose');
const { createApplicationLog } = require("model-hook/common_function/createLog");

exports.updateTermsAndCondition = async(req,res)=>{
    try {
        const{title,description,addedBy,termsAndConditionId} = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin")) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if(!(mongoose.Types.ObjectId.isValid(addedBy) && mongoose.Types.ObjectId.isValid(termsAndConditionId))){
            return res.status(400).send({status:0, message: 'Invalid product IDs',data:[] });
        }

        if (!(title || description && addedBy && termsAndConditionId)) {
            return res.status(409).send({ status: 0, message: "Title and description are required" });
        }

        const data = await TermsAndConditions.findOneAndUpdate(
            { _id: termsAndConditionId, addedBy: addedBy, isDeleted: false },
            { $set: { title: title, description: description } },
            { new: true }
        );

        if (!data) {
            return res.status(404).send({ status: 0, message: "Error updating terms and conditions", data: [] });
        }

        await createApplicationLog("TermsAndCondition", "update terms and condition", {}, {}, addedBy);

        return res.status(201).send({ status: 1, message: "Record updated successfully!" });
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });   
    }
}