const TermsAndConditions = require("model-hook/Model/terms&Conditions");
const Admin = require("model-hook/Model/adminModel");
const mongoose = require('mongoose');

exports.addTermsAndCondition = async(req,res)=>{
    try {
        const{title,description,addedBy} = req.body;

           // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
         // if (loginUser?.data?.role != 'ADMIN') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }

        if(!mongoose.Types.ObjectId.isValid(addedBy)){
            return res.status(400).send({status:0, message: 'Invalid product IDs',data:[] });
        }

        if(!(title && description && addedBy)){
            return res
            .status(409)
            .send({ status: 0, message: "All fields are required" });
        }

        const exist = await TermsAndConditions.findOne({title:title,addedBy:addedBy});

        if(exist){
            return res.status(409).send({status:0,message:"Record already exist",data:[]})
        }

        const termsAndConditionData = {
            title,
            description,
            addedBy
        }

        const data = await new TermsAndConditions(termsAndConditionData).save()

        if(!data){
            return res.status(404).send({status:0,message:"Error in creating terms and condition",data:[]});
        }

        return res.status(201).send({status:1,message:"Record added successfully!",data:data})
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });   
    }
}