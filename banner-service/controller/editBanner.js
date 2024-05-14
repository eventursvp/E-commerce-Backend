const Banner = require('model-hook/Model/bannerModel');

const Admin = require("model-hook/Model/adminModel");
const { default: mongoose } = require("mongoose");



exports.updateBanner = async(req,res)=>{
    try {
        const {bannerId,addedBy,title,image,url} = req.body

         // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        // if (loginUser?.data?.role != 'ADMIN') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }

        if(!(bannerId && addedBy )){
            return res.status(403).send({status:0,message:"All fields are required",data:[]})
        }

        if(!(mongoose.Types.ObjectId.isValid(addedBy) && mongoose.Types.ObjectId.isValid(bannerId))){
            return res.status(403).send({status:0,message:"Invalid request"})
        }

        if(!(bannerId && addedBy) && !(title || image || url)){
            return res.status(403).send({status:0,message:"All fields are required",data:[]})
        }

        const data = await Banner.findOneAndUpdate({_id:bannerId,isDeleted:false,addedBy:addedBy},{
            $set:{
                title:title,
                url:url,
                image:image,
            }
        },{new:true});

        if (!data) {
            return res.status(404).send({
                status: 0,
                error: "Error in updating product",
                data: [],
            });
        }

        return res.status(201).send({
            status: 1,
            message: "Record updated successfully!",
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