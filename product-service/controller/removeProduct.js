const Product = require("model-hook/Model/productModel");
const Admin = require("model-hook/Model/adminModel");
const RecentViewedProducts = require("model-hook/Model/recentViewedProduct");
const { createApplicationLog } = require("model-hook/common_function/createLog");

const mongoose = require("mongoose");

exports.removeProduct = async (req, res) => {
    try {
        const { productId,addedBy } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin" )) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (!(mongoose.Types.ObjectId.isValid(productId) && mongoose.Types.ObjectId.isValid(addedBy))) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }
        const productData = await Product.findOne({
            _id: productId,
            isDeleted: false,
        });

        if (!productData) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }
        const resp = await Product.findByIdAndUpdate(
            {_id:productId,addedBy:addedBy},
            { $set: { isDeleted: true } },
            { new: true }
        );
        if (resp) {
            return res.status(200).send({
                status: 1,
                messae: "Record deleted successfully!",
            });
        }

        await createApplicationLog("Product", "remove product", {}, {}, addedBy);

        return res.status(403).send({
            status: 1,
            messae: "Error in  deleting record",
            data: [],
        });
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
};


exports.removeProductFromRecentView = async (req, res) => {
    try {
        const { productId,addedBy } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(mongoose.Types.ObjectId.isValid(productId) && mongoose.Types.ObjectId.isValid(addedBy))) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }
        const productData = await RecentViewedProducts.findOne({
            productId: productId,
            isDeleted: false,
        });

        if (!productData) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }
        const resp = await RecentViewedProducts.findOneAndUpdate(
            {productId:productId,addedBy:addedBy},
            { $set: { isDeleted: true } },
            { new: true }
        );
        if (resp) {
            return res.status(200).send({
                status: 1,
                messae: "Record deleted successfully!",
            });
        }

        await createApplicationLog("Product", "remove recent viewed product", {}, {}, addedBy);

        return res.status(403).send({
            status: 1,
            messae: "Error in  deleting record",
            data: [],
        });
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
};