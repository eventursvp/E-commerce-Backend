const Brand = require("model-hook/Model/brandModel");

const Admin = require("model-hook/Model/adminModel");
const  mongoose  = require("mongoose");



exports.updateBrand = async(req,res)=>{
    try {
        const {brandId,addedBy,name} = req.body

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin" )) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if(!(mongoose.Types.ObjectId.isValid(addedBy) && mongoose.Types.ObjectId.isValid(brandId))){
            return res.status(403).send({status:0,message:"Invalid request"})
        }

        if(!(brandId && addedBy && name)){
            return res.status(403).send({status:0,message:"All fields are required",data:[]})
        }

        const data = await Brand.findOneAndUpdate({_id:brandId,isDeleted:false,addedBy:addedBy},{
            $set:{
                name:name,
            }
        },{new:true});

        if (!data) {
            return res.status(404).send({
                status: 0,
                error: "Error in updating product",
                data: [],
            });
        }

        return res.status(200).send({
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