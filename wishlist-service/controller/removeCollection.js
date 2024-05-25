const WishListCollection = require('model-hook/Model/wishlistCollectionModel');
const User = require('model-hook/Model/userModel');
const Product = require('model-hook/Model/productModel');

const mongoose = require('mongoose');


exports.removeWishlistCollection = async(req,res)=>{
    try {
        const {collectionId,addedBy} = req.body

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "User")) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if(!(collectionId && addedBy)){
            return res.status(403).send({status:0,message:"All fields are required",data:[]})
        }
    
          if(!(mongoose.Types.ObjectId.isValid(collectionId) && mongoose.Types.ObjectId.isValid(addedBy))){
              return res.status(403).send({status:0,message:"Invalid request",data:[]})
          }

          const data = await WishListCollection.findByIdAndDelete({_id:collectionId,addedBy:addedBy});

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