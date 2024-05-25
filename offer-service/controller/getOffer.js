const Offer = require('model-hook/Model/offerModel');
const User = require('model-hook/Model/userModel');
const Product = require('model-hook/Model/productModel');

const mongoose = require('mongoose');


exports.getOffer = async(req,res)=>{
    try {

        
        const {offerId,addedBy} = req.body;
        
        //   const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        
        if(!(offerId && addedBy)){
            return res.status(403).send({status:0,message:"Invalid request",data:[]})
        }
        
        const data = await Offer.findOne({_id:offerId})

        if (!data) {
            return res.status(404).send({
                status: 0,
                error: "Record not found",
                data: [],
            });
        }

        return res.status(200).send({
            status: 1,
            message: "Record Fetched Successfully!",
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


exports.getAllOffers = async(req,res)=>{
    try {
        const {addedBy} = req.body

          // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }

        if(!addedBy){
            return res.status(403).send({status:0,message:"Invalid request",data:[]})
        }

        let currentDate = new Date();
        currentDate.setUTCHours(0,0,0,0)

        const data = await Offer.find({  endDate: { $lte: currentDate } });

        if (!data || data.length === 0) {
            return res.status(404).send({ status: 0, message: "Record not found", data: [] });
        }

        return res.status(200).send({
            status: 1,
            message: "Record Fetched Successfully!",
            data: data,
        });
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(403).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });    
    }
}