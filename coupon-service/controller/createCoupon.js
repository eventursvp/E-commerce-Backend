const Coupon = require("model-hook/Model/userCoupon");
const Admin = require("model-hook/Model/adminModel");
const Product = require("model-hook/Model/productModel");
const mongoose = require('mongoose');
const { createApplicationLog } = require("model-hook/common_function/createLog");


exports.createCoupon = async(req,res)=>{
    try {
        const { title, code, startDate, endDate, productIds, discountType, discountValue, maxUses, addedBy } = req.body;

         
        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin")) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (!(addedBy && title && code && startDate && endDate && productIds && discountType && discountValue && maxUses )) {
            return res
                .status(409)
                .send({ status: 0, message: "All fields are required" });
        }

        const exist = await Coupon.findOne({addedBy:addedBy,title:title,code:code,isDeleted:false,isActive:true});

        if(exist){
            return res.status(409).send({status:0,message:"Record already exist",data:[]})
        }

       
        const invalidProductIds = productIds.filter(productId => !mongoose.Types.ObjectId.isValid(productId));
         if (invalidProductIds.length > 0) {
             return res.status(400).send({status:0, message: 'Invalid product IDs',data:[] });
         }

         if (
            !(
                mongoose.Types.ObjectId.isValid(addedBy)
            )
        ) {
            return res
                .status(403)
                .send({ status: 0, message: "Invalid request" });
        }
 
         const existingProducts = await Product.find({ _id: { $in: productIds } });
         if (existingProducts.length !== productIds.length) {
             return res.status(400).send({status:0, message: 'Some products do not exist',data:[] });
         }

         const currentDate = new Date();
         currentDate.setUTCHours(0,0,0,0)
         const start = new Date(startDate);
         const end = new Date(endDate);
 
         if (start < currentDate || end < currentDate) {
             return res.status(400).json({ status: 0, message: 'Start date and end date must be greater than the current date', data: [] });
         }


        const coupon = new Coupon({
            title,
            code,
            startDate:start.toISOString().slice(0, 10),
            endDate:end.toISOString().slice(0,10),
            productIds,
            discountType,
            discountValue,
            maxUses,
            addedBy
        });

        // Save the coupon to the database
        await coupon.save();

        await createApplicationLog("Coupon", "create coupon", {}, {}, addedBy);


        res.status(201).json({ message: 'Coupon created successfully', coupon });

    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
}