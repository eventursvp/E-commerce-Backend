const TermsAndConditions = require("model-hook/Model/terms&Conditions");
const Admin = require("model-hook/Model/adminModel");
const mongoose = require('mongoose');
const { createApplicationLog } = require("model-hook/common_function/createLog");

exports.getTermsAndCondition = async(req,res)=>{
    try {
        const{addedBy,termsAndConditionId} = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if(!(mongoose.Types.ObjectId.isValid(addedBy) && mongoose.Types.ObjectId.isValid(termsAndConditionId))){
            return res.status(400).send({status:0, message: 'Invalid product IDs',data:[] });
        }

        if (!(addedBy && termsAndConditionId)) {
            return res.status(409).send({ status: 0, message: "Title and description are required" });
        }

        const data = await TermsAndConditions.findOne(
            { _id: termsAndConditionId, isDeleted: false }
        );

        if (!data) {
            return res.status(404).send({ status: 0, message: "Record not found", data: [] });
        }

        await createApplicationLog("TermsAndCondition", "get terms and condition", {}, {}, addedBy);

        return res.status(201).send({ status: 1, message: "Record fetched successfully!",data:data });
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });   
    }
}


exports.getProductTermsAndCondition = async(req,res)=>{
    try {
        const{addedBy,termsAndConditionId,productId} = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if(!(mongoose.Types.ObjectId.isValid(addedBy) && mongoose.Types.ObjectId.isValid(termsAndConditionId) && mongoose.Types.ObjectId.isValid(productId))){
            return res.status(400).send({status:0, message: 'Invalid product IDs',data:[] });
        }

        if (!(addedBy && termsAndConditionId && productId)) {
            return res.status(409).send({ status: 0, message: "Title and description are required" });
        }

        const data = await TermsAndConditions.findOne(
            { _id: termsAndConditionId, isDeleted: false ,productId:productId}
        );

        if (!data) {
            return res.status(404).send({ status: 0, message: "Record not found", data: [] });
        }

        await createApplicationLog("TermsAndCondition", "get terms and condition", {}, {}, addedBy);

        return res.status(201).send({ status: 1, message: "Record fetched successfully!",data:data });
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });   
    }
}