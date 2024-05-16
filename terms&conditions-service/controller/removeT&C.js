const TermsAndCondition = require("model-hook/Model/terms&Conditions");
const Admin = require("model-hook/Model/adminModel");
const mongoose  = require("mongoose");


exports.deleteTermsAndCondtion = async(req,res) =>{
    try {
        const { termsAndConditionId , addedBy } = req.body;

        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        // if (loginUser?.data?.role != 'ADMIN') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }

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