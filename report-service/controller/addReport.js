const Report = require("model-hook/Model/reportModel");
const ProductRatingReview = require("model-hook/Model/productRatingReviewModel");
const BlogComment = require("model-hook/Model/blogCommentsModel");
const Product = require("model-hook/Model/productModel")
const mongoose = require("mongoose");
const { createApplicationLog } = require("model-hook/common_function/createLog");


exports.addReportOnProductReview = async(req,res)=>{
    try {
        const {productRatingReviewId,reason,addedBy,productId,blogCommentId} = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "User")) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (
            !(
                mongoose.Types.ObjectId.isValid(productRatingReviewId) &&
                mongoose.Types.ObjectId.isValid(addedBy)

            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }

        if(!(productRatingReviewId && reason && addedBy)){
            return res.status(409).send({status:0,message:"All fields are required"})
        }

        if(productRatingReviewId && (productId || blogCommentId) ){
            return res.status(400).send({status:0,message:"Only productRatingReviewId required",data:[]})
        }

        if(!['Inappropriate', 'Off topic', 'Fake', 'Other'].includes(reason)){
            return res.status(400).send({status:0,message:"Invalid reason",data:[]})
        }

        const productReviewData = ProductRatingReview.findOne({_id:productRatingReviewId})

        if(!productReviewData){
            return res.status(404).send({status:0,message:"productRatingReviewId not found",data:[]})
        }

        const reportData = {
            productRatingReviewId,
            addedBy,
            reason,
            reportType:"Product Rating Review"
        }

        const data = await new Report(reportData).save();

       if(!data){
            return res.status(404).send({status:0,message:"Error in creating report",data:[]});
        }

        await createApplicationLog("Report", "add report on product review", {}, {}, addedBy);

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


exports.addReportOnBlogComment = async(req,res)=>{
    try {
        const {productRatingReviewId,reason,addedBy,productId,blogCommentId} = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "User")) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (
            !(
                mongoose.Types.ObjectId.isValid(blogCommentId) &&
                mongoose.Types.ObjectId.isValid(addedBy)

            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }

        if(!(blogCommentId && reason && addedBy)){
            return res.status(409).send({status:0,message:"All fields are required"})
        }

        if(blogCommentId && (productId || productRatingReviewId) ){
            return res.status(400).send({status:0,message:"Only blogCommentId required",data:[]})
        }

        if(!['Inappropriate', 'Off topic', 'Fake', 'Other'].includes(reason)){
            return res.status(400).send({status:0,message:"Invalid reason",data:[]})
        }

        const BlogCommentData = BlogComment.findOne({_id:blogCommentId})

        if(!BlogCommentData){
            return res.status(404).send({status:0,message:"productRatingReviewId not found",data:[]})
        }

        const reportData = {
            blogCommentId,
            addedBy,
            reason,
            reportType:"Blog Comment"
        }

        const data = await new Report(reportData).save();

       if(!data){
            return res.status(404).send({status:0,message:"Error in creating report",data:[]});
        }

        await createApplicationLog("Report", "add report on blog comment", {}, {}, addedBy);

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


exports.addReportOnProduct = async(req,res)=>{
    try {
        const {productRatingReviewId,reason,addedBy,productId,blogCommentId} = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "User")) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (
            !(
                mongoose.Types.ObjectId.isValid(productId) &&
                mongoose.Types.ObjectId.isValid(addedBy)

            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }

        if(!(productId && reason && addedBy)){
            return res.status(409).send({status:0,message:"All fields are required"})
        }

        if(productId && (blogCommentId || productRatingReviewId) ){
            return res.status(400).send({status:0,message:"Only productId required",data:[]})
        }

        if(!['Inappropriate', 'Off topic', 'Fake', 'Other'].includes(reason)){
            return res.status(400).send({status:0,message:"Invalid reason",data:[]})
        }

        const productData = Product.findOne({_id:productId,isDeleted:false,isPublic:true})

        if(!productData){
            return res.status(404).send({status:0,message:"productId not found",data:[]})
        }

        const reportData = {
            productId,
            addedBy,
            reason,
            reportType:"Product"
        }

        const data = await new Report(reportData).save();

       if(!data){
            return res.status(404).send({status:0,message:"Error in creating report",data:[]});
        }

        await createApplicationLog("Report", "add report on product", {}, {}, addedBy);

        return res.status(201).send({status:1,message:"Record added successfully!",data:data});

    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
}