const Banner = require("model-hook/Model/bannerModel");
const Admin = require("model-hook/Model/adminModel");
const User = require("model-hook/Model/adminModel");
const mongoose = require("mongoose");

exports.getOneBanner = async (req, res) => {
    try {
        const { bannerId, addedBy } = req.body;

        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        // if (loginUser?.data?.role != 'ADMIN') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }
        if (!(bannerId && addedBy)) {
            return res.status(403).send({
                status: 0,
                message: "All fields are required",
                data: [],
            });
        }

        if (
            !(
                mongoose.Types.ObjectId.isValid(bannerId) &&
                mongoose.Types.ObjectId.isValid(addedBy)
            )
        ) {
            return res.status(403).send({ status: 0, message: "Invalid request" });
        }

        const data = await Banner.findOne({
            _id: bannerId,
            addedBy: addedBy,
            isDeleted: false,
        });

        if (!data) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }

        return res.status(200).send({
            status: 1,
            message: "Record fetched successfull",
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
};


exports.getAllBanners = async (req, res) => {
    try {
        const { addedBy } = req.body;

        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        if (!addedBy) {
            return res.status(403).send({
                status: 0,
                message: "All fields are required",
                data: [],
            });
        }

        if (
            !
                mongoose.Types.ObjectId.isValid(addedBy)
        ) {
            return res.status(403).send({ status: 0, message: "Invalid request" });
        }

        const data = await Banner.find({
            isDeleted: false,
        });

        if (!data || data.length === 0) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }

        return res.status(200).send({
            status: 1,
            message: "Record fetched successfull",
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
};
