const Gift = require("model-hook/Model/giftModel");
const mongoose = require("mongoose");

exports.addGift = async(req,res)=>{
    try {
        const {message,from,recipientsEmail,deliveryAddress,giftBafBox,emailOnGiftMessage,addedBy} = req.body

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if(!(message && from && recipientsEmail && deliveryAddress && addedBy)){
            return res.status(403).send({status:0,message:"All fields are required",data:[]})
        }
        if(!mongoose.Types.ObjectId.isValid(addedBy)){
            return res.status(403).send({status:0,message:"Invalid request"})
        }

        const giftData = {
            message,
            from,
            recipientsEmail,
            deliveryAddress,
            addedBy,
            giftBafBox,
            emailOnGiftMessage
        }

        const data = await new Gift(giftData).save()

        if(!data){
            return res.status(404).send({status:0,message:"Error in creating gift",data:[]});
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
