const WishList = require('model-hook/Model/wishlistModel');
const User = require('model-hook/Model/userModel');
const Product = require('model-hook/Model/productModel');

const mongoose = require('mongoose');


exports.removeWishlist = async(req,res)=>{
    try {
        const {wishlistId,productId,addedBy} = req.body

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "User")) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if(!(productId && addedBy && wishlistId)){
            return res.status(403).send({status:0,message:"All fields are required",data:[]})
        }
    
          if(!(mongoose.Types.ObjectId.isValid(productId) && mongoose.Types.ObjectId.isValid(addedBy)  && mongoose.Types.ObjectId.isValid(wishlistId))){
              return res.status(403).send({status:0,message:"Invalid request",data:[]})
          }

          const wishlistData = await WishList.findOne({
            _id: wishlistId,
            items: { $in: [productId] },
            addedBy: addedBy
        });
          if(!wishlistData){
            return res.status(403).send({status:0,message:"Record not found",data:[]})

          }

          const data = await WishList.findOneAndUpdate({_id:wishlistId,addedBy:addedBy },{ $pull: { items: productId } }, { new: true });

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