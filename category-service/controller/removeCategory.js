const Category = require("model-hook/Model/categoriesModel");
const Admin = require("model-hook/Model/adminModel");
const mongoose  = require("mongoose");


exports.removeCategory = async(req,res) =>{
    try {
        const { categoryId , addedBy } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin" )) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (!(mongoose.Types.ObjectId.isValid(categoryId) && mongoose.Types.ObjectId.isValid(addedBy))) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }
        const categoryData = await Category.findOne({
            _id: categoryId,
            isDeleted: false,
        });

        if (!categoryData) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }
        const resp = await Category.findByIdAndUpdate(
            categoryId,
            { $set: { isDeleted: true } },
            { new: true }
        );
        if (resp) {
            return res.status(200).send({
                status: 1,
                messae: "Record deleted successfully!",
            });
        }
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
}


exports.removeSubCategory = async(req,res) =>{
    try {
        const { subCategoryId , addedBy } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin" )) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (!(mongoose.Types.ObjectId.isValid(subCategoryId) && mongoose.Types.ObjectId.isValid(addedBy))) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }
        const subCategoryData = await Category.findOne({
            _id: subCategoryId,
            parentCategoryId:{$ne:null},
            childCategoryId:{$eq:null},

            isDeleted: false,
            addedBy:addedBy
        });

        if (!subCategoryData) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }
        const resp = await Category.findByIdAndUpdate(
            subCategoryId,
            { $set: { isDeleted: true } },
            { new: true }
        );
        if (resp) {
            return res.status(200).send({
                status: 1,
                messae: "Record deleted successfully!",
            });
        }
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
}

exports.removeSpecificCategory = async(req,res) =>{
    try {
        const { specificCategoryId , addedBy } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin" )) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (!(mongoose.Types.ObjectId.isValid(specificCategoryId) || mongoose.Types.ObjectId.isValid(addedBy))) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }
        const categoryData = await Category.findOne({
            _id: specificCategoryId,
            isDeleted: false,
            categoryId:{$ne :null},
            subCategoryId:{$ne :null},

        });

        if (!categoryData) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }
        const resp = await Category.findByIdAndUpdate(
            specificCategoryId,
            { $set: { isDeleted: true } },
            { new: true }
        );
        if (resp) {
            return res.status(200).send({
                status: 1,
                messae: "Record deleted successfully!",
            });
        }
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
}