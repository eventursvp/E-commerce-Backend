const Banner = require("model-hook/Model/bannerModel");
const Admin = require("model-hook/Model/adminModel");
const mongoose  = require("mongoose");
const { createApplicationLog } = require("model-hook/common_function/createLog");


exports.removeBanner = async(req,res) =>{
    try {
        const { bannerId , addedBy } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin" )) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (!(mongoose.Types.ObjectId.isValid(bannerId) && mongoose.Types.ObjectId.isValid(addedBy))) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }
        const bannerData = await Banner.findOne({
            _id: bannerId,
            isDeleted: false,
            addedBy:addedBy
        });

        if (!bannerData) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }
        const resp = await Banner.findByIdAndUpdate(
            bannerId,
            { $set: { isDeleted: true } },
            { new: true }
        );
        if (resp) {
            return res.status(200).send({
                status: 1,
                messae: "Record deleted successfully!",
            });
        }

        await createApplicationLog("Banner", "remove banner", {}, {}, addedBy);

        return res.status(404).send({
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
}