const Report = require("model-hook/Model/reportModel");
const ProductRatingReview = require("model-hook/Model/productRatingReviewModel");
const BlogComment = require("model-hook/Model/blogCommentsModel");
const Product = require("model-hook/Model/productModel")
const mongoose = require("mongoose");


exports.getOneReport = async(req,res)=>{
    try {
        const {reportId,addedBy} = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin" )) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if(!(mongoose.Types.ObjectId.isValid(addedBy) && mongoose.Types.ObjectId.isValid(reportId))){
            return res.status(400).send({status:0, message: 'Invalid request',data:[] });
        }

        if(!(reportId && addedBy )){
            return res.status(400).send({status:0,message:"All fields are required",data:[]})
        }

        const data = await Report.findOne({_id:reportId,isDeleted:false});

        if(!data){
            return res.status(404).send({status:0,message:"Record not found",data:[]});
        }

        return res.status(200).send({status:1,message:"Record fetched successfully!",data:data});

    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
}


exports.getAllReport = async(req,res)=>{
    try {
        const {addedBy,reportType } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin")) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if(!(mongoose.Types.ObjectId.isValid(addedBy))){
            return res.status(400).send({status:0, message: 'Invalid request',data:[] });
        }

        if(!(addedBy)){
            return res.status(400).send({status:0,message:"All fields are required",data:[]})
        }

        if(reportType){
        const data = await Report.find({reportType:reportType,isDeleted:false});

        if(!data.length){
            return res.status(404).send({status:0,message:"Record not found",data:[]});
        }

        return res.status(200).send({status:1,message:"Record fetched successfully!",data:data});
        }
        const data = await Report.find({isDeleted:false});

        if(!data.length){
            return res.status(404).send({status:0,message:"Record not found",data:[]});
        }

        return res.status(200).send({status:1,message:"Record fetched successfully!",data:data});

    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
}