const TermsAndCondition = require("model-hook/Model/terms&Conditions");
const Admin = require("model-hook/Model/adminModel");
const mongoose  = require("mongoose");
const { createApplicationLog } = require("model-hook/common_function/createLog");


exports.deleteTermsAndCondtion = async(req,res) =>{
    try {
        const { termsAndConditionId , addedBy } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin")) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (!(mongoose.Types.ObjectId.isValid(termsAndConditionId) && mongoose.Types.ObjectId.isValid(addedBy))) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }
        const data = await TermsAndCondition.findOne({
            _id: termsAndConditionId,
            isDeleted: false,
            addedBy:addedBy
        });

        if (!data) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }
        const resp = await TermsAndCondition.findByIdAndUpdate(
            termsAndConditionId,
            { $set: { isDeleted: true } },
            { new: true }
        );
        if (resp) {
            return res.status(200).send({
                status: 1,
                messae: "Record deleted successfully!",
            });
        }

        await createApplicationLog("TermsAndCondition", "remove terms and condition", {}, {}, addedBy);

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
}


exports.deleteProductTermsAndCondtion = async(req,res)=>{
    try {
        const { termsAndConditionId , addedBy,productId } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin")) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (!(mongoose.Types.ObjectId.isValid(termsAndConditionId) && mongoose.Types.ObjectId.isValid(addedBy) && mongoose.Types.ObjectId.isValid(productId))) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }
        const data = await TermsAndCondition.findOne({
            _id: termsAndConditionId,
            isDeleted: false,
            addedBy:addedBy,
            productId:productId
        });

        if (!data) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }
        const resp = await TermsAndCondition.findOneAndUpdate(
            {_id:termsAndConditionId,productId:productId},
            { $set: { isDeleted: true } },
            { new: true }
        );
        if (resp) {
            return res.status(200).send({
                status: 1,
                messae: "Record deleted successfully!",
            });
        }

        await createApplicationLog("TermsAndCondition", "remove product terms and condition", {}, {}, addedBy);

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
}