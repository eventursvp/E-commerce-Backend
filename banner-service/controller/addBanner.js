const Banner = require("model-hook/Model/bannerModel");
const Admin = require("model-hook/Model/adminModel");
const mongoose = require("mongoose");


exports.addBanner = async(req,res)=>{
    try {
        const {title,url,image,addedBy} = req.body

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin" )) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if(!(title && url || image && addedBy)){
            return res.status(403).send({status:0,message:"All fields are required",data:[]})
        }
        if(!mongoose.Types.ObjectId.isValid(addedBy)){
            return res.status(403).send({status:0,message:"Invalid request"})
        }

        const bannerData = {
            title,
            url,
            image,
            addedBy
        }

        const data = await new Banner(bannerData).save()

        if(!data){
            return res.status(404).send({status:0,message:"Error in creating banner",data:[]});
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