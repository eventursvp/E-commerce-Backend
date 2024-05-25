const Report = require("model-hook/Model/reportModel");
const ProductRatingReview = require("model-hook/Model/productRatingReviewModel");
const BlogComment = require("model-hook/Model/blogCommentsModel");
const Product = require("model-hook/Model/productModel")
const mongoose = require("mongoose");


exports.removeReport = async(req,res)=>{
    try {
        const {reportId,addedBy} = req.body;

        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        //  if (loginUser?.data?.role != 'Admin') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }

        if(!(mongoose.Types.ObjectId.isValid(addedBy) && mongoose.Types.ObjectId.isValid(reportId))){
            return res.status(400).send({status:0, message: 'Invalid request',data:[] });
        }

        if(!(reportId && addedBy )){
            return res.status(400).send({status:0,message:"All fields are required",data:[]})
        }

        const data = await Report.findOneAndUpdate({_id:reportId,isDeleted:false},{$set:{isDeleted:true}},{new:true});

        if(!data){
            return res.status(404).send({status:0,message:"Record not found",data:[]});
        }

        return res.status(200).send({status:1,message:"Record deleted successfully!"});

    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
}