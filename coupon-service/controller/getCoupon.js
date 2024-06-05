const Coupon = require("model-hook/Model/userCoupon");
const Admin = require("model-hook/Model/adminModel");
const Product = require("model-hook/Model/productModel");
const mongoose = require('mongoose');
const { createApplicationLog } = require("model-hook/common_function/createLog");


exports.getOneCoupon = async(req,res)=>{
    try {
        const {couponId,addedBy} =req.body

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin")) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if(!(mongoose.Types.ObjectId.isValid(couponId) && mongoose.Types.ObjectId.isValid(addedBy))){
            return res.status(403).send({status:0,message:"Invalid request",data:[]})
        }

        if(!(couponId && addedBy)){
            return res.status(409).send({status:0,message:"All fields are required",data:[]})
        }

        const data = await Coupon.findOne({_id:couponId,addedBy:addedBy})

        if(!data){
            return res.status(404).send({status:0,message:"Record not found",data:[]})
        }

        await createApplicationLog("Coupon", "get coupon", {}, {}, addedBy);


        return res.status(200).send({status:0,message:"Record fetched successfully",data:data})
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
}


exports.getAllCoupons = async(req,res)=>{
    try {
        const {addedBy} =req.body

         const { loginUser } = req;
        if (loginUser?.data?._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access." });
        }

        if(!( mongoose.Types.ObjectId.isValid(addedBy))){
            return res.status(403).send({status:0,message:"Invalid request",data:[]})
        }

        if(!(addedBy)){
            return res.status(409).send({status:0,message:"All fields are required",data:[]})
        }

        const data = await Coupon.find({isActive:true,isDeleted:false})

        if(!data || data.length === 0){
            return res.status(404).send({status:0,message:"Record not found",data:[]})
        }

        await createApplicationLog("Coupon", "get all coupon", {}, {}, addedBy);

        return res.status(200).send({status:0,message:"Record fetched successfully",data:data})
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
}