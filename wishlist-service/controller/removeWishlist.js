const WishList = require('model-hook/Model/wishlistModel');
const User = require('model-hook/Model/adminModel');
const Product = require('model-hook/Model/productModel');

const mongoose = require('mongoose');


exports.removeWishlist = async(req,res)=>{
    try {
        const {wishlistId,addedBy} = req.body

          // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        // if (loginUser?.data?.role != 'USER') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }

        if(!(wishlistId && addedBy)){
            return res.status(403).send({status:0,message:"All fields are required",data:[]})
        }
    
          if(!(mongoose.Types.ObjectId.isValid(wishlistId) && mongoose.Types.ObjectId.isValid(addedBy))){
              return res.status(403).send({status:0,message:"Invalid request",data:[]})
          }

          const data = await WishList.findByIdAndDelete({_id:wishlistId,addedBy:addedBy});

          if(!data){
            return res.status(404).send({status:0,message:"Record not found",data:[]})
          }
          return res.status(200).send({status:1,message:"Record deleted successfully!"})
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });   
    }
}