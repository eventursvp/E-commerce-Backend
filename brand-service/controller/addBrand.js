const Brand = require("model-hook/Model/brandModel");
const Admin = require("model-hook/Model/adminModel");
const { default: mongoose } = require("mongoose");


exports.addBrand = async(req,res)=>{
    try {
        const {name,addedBy} = req.body

         // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        // if (loginUser?.data?.role != 'ADMIN') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }

        if(!(name && addedBy)){
            return res.status(403).send({status:0,message:"All fields are required",data:[]})
        }
        if(!mongoose.Types.ObjectId.isValid(addedBy)){
            return res.status(403).send({status:0,message:"Invalid request"})
        }

        const alreadyExist = await Brand.findOne({addedBy:addedBy,name:name});

        if(alreadyExist){
            return res.status(409).send({status:0,message:"Record already exist",data:[]})
        }

        const brandData = {
            name,
            addedBy
        }

        const data = await new Brand(brandData).save()

        if(!data){
            return res.status(404).send({status:0,message:"Error in creating brand",data:[]});
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