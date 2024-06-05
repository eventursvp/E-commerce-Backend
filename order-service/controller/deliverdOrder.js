const Order = require("model-hook/Model/orderModel");
const User = require("model-hook/Model/userModel");
const Product = require("model-hook/Model/productModel");
const Cart = require("model-hook/Model/cartModel");
const mongoose = require('mongoose');
const {createNotification} = require("model-hook/common_function/createNotification");


exports.deliverdOrder = async(req,res)=>{
    try {
        const {orderId,addedBy} = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin")) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }
        if ( !(mongoose.Types.ObjectId.isValid(addedBy) && mongoose.Types.ObjectId.isValid(orderId)) )
            {
               return res.status(403).send({
                   status: 0,
                   message: "Invalid request",
                   data: [],
               });
           }
        const order = await Order.findOne({_id:orderId});
        if (!order) {
            return res.status(404).json({ status: 0, message: 'Order not found' });
        }

        if (order.orderStatus === 'DELIVERED' || order.orderStatus === 'CANCELLED' || order.orderStatus === 'RETURN') {
            return res.status(400).send({ status: 0, message: 'Order cannot be deliverd',data:[] });
        }

        order.orderStatus = 'DELIVERED';
        await order.save();
        await createNotification(addedBy,"Order","OrderDelivered","Order deliverd","Order deliverd Successfully",order._id);
        await createApplicationLog("Order", "order deliverd", {}, {}, addedBy);

        return res.status(200).json({ status: 1, message: 'Order deliverd successfully'});
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
}