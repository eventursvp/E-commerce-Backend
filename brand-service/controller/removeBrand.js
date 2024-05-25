const Brand = require("model-hook/Model/brandModel");
const Admin = require("model-hook/Model/adminModel");
const mongoose  = require("mongoose");


exports.removeBrand = async(req,res) =>{
    try {
        const { brandId , addedBy } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin" )) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (!(mongoose.Types.ObjectId.isValid(brandId) && mongoose.Types.ObjectId.isValid(addedBy))) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }
        const bannerData = await Brand.findOne({
            _id: brandId,
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
        const resp = await Brand.findByIdAndUpdate(
            brandId,
            { $set: { isDeleted: true } },
            { new: true }
        );
        if (!resp) {
            return res.status(404).send({
                status: 1,
                messae: "Error in  deleting record",
                data: [],
            });
        }
        
        return res.status(200).send({
            status: 1,
            messae: "Record deleted successfully!",
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