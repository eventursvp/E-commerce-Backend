const Order = require("model-hook/Model/orderModel");
const User = require("model-hook/Model/userModel");
const Product = require("model-hook/Model/productModel");
const Cart = require("model-hook/Model/cartModel");
const mongoose = require('mongoose');
const {createNotification} = require("model-hook/common_function/createNotification");
const { createApplicationLog } = require("model-hook/common_function/createLog");


exports.cancelOrder = async (req, res) => {
    try {
        const { orderId ,addedBy} = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "User")) {
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
        const order = await Order.findOne({_id:orderId,addedBy:addedBy});
        if (!order) {
            return res.status(404).json({ status: 0, message: 'Order not found' });
        }

        if (order.orderStatus === 'CANCELLED' || order.orderStatus === 'COMPLETED') {
            return res.status(400).send({ status: 0, message: 'Order cannot be cancelled',data:[] });
        }

        order.orderStatus = 'CANCELLED';
        await order.save();
        await createNotification(addedBy,"Order","OrderCancelled","Order cancelled","Order cancelled Successfully",order._id);
        await createApplicationLog("Order", "order cancelled", {}, {}, addedBy);
        
        return res.status(200).json({ status: 1, message: 'Order cancelled successfully'});
    } catch (error) {
        console.error('Error cancelling order:', error);
        return res.status(500).json({ status: 0, message: 'Internal Server Error' });
    }
};
