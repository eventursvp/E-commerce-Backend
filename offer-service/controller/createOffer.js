const Offer = require('model-hook/Model/offerModel');
const User = require('model-hook/Model/userModel');
const Product = require('model-hook/Model/productModel');

const mongoose = require('mongoose');


exports.createOffer = async(req,res)=>{
    try {
        const {name,discountType,discountCode,minimumPurchaseAmount,numberOfPurchase,limitOfPurchaseUser,startDate,endDate,addedBy} = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin" )) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }
      
        if(!(name && discountType && discountCode && minimumPurchaseAmount && numberOfPurchase && limitOfPurchaseUser && startDate && endDate && addedBy)){
            return res.status(403).send({status:0,message:"Invalid request",data:[]})
        }

        if(!["PERCENTAGE","AMOUNT"].includes(discountType)){
            return res.status(403).send({status:0,message:"Invalid discountType",data:[]})
        }

        const exist = await Offer.findOne({name:name});

        if(exist){
            return res.status(409).send({status:0,message:"Offer already exist",data:[]})
        }

        const code = await Offer.findOne({discountCode:discountCode});

        if(code){
            return res.status(409).send({status:0,message:"discount Code already exist",data:[]})
        }
        
        const data = await new Offer(req.body).save();

        data.offerStatus = "ACTIVE"

        data.save()

        if (!data) {
            return res.status(403).send({
                status: 0,
                error: "Error in adding offer",
                data: [],
            });
        }

        return res.status(201).send({
            status: 1,
            message: "Record added successfully!",
            data: data,
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