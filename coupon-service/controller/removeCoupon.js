const Coupon = require("model-hook/Model/userCoupon");
const Admin = require("model-hook/Model/adminModel");
const Product = require("model-hook/Model/productModel");
const mongoose = require("mongoose");


exports.removeCoupon = async (req, res) => {
    try {
        const {
            addedBy,
            couponId,
        } = req.body;

        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        // if (loginUser?.data?.role != 'ADMIN') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }

        if (
            !(
                mongoose.Types.ObjectId.isValid(couponId) &&
                mongoose.Types.ObjectId.isValid(addedBy)
            )
        ) {
            return res
                .status(403)
                .send({ status: 0, message: "Invalid request", data: [] });
        }

        if (!(couponId && addedBy)) {
            return res
                .status(409)
                .send({
                    status: 0,
                    message: "All fields are required",
                    data: [],
                });
        }


        const data = await Coupon.findOneAndUpdate(
            { _id: couponId, addedBy: addedBy, isDeleted: false },
            {$set:{isDeleted:true}},
            {new:true}
        );

        if(!data){
            return res.status(404).send({status:0,message:"Record not found",data:[]})
        }

        return res.status(200).send({status:0,message:"Record deleted successfully"})
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
};