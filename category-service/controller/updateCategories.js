const Category = require("model-hook/Model/categoriesModel");
const Admin = require("model-hook/Model/adminModel");
const mongoose = require("mongoose");

exports.updateCategory = async (req, res) => {
    try {
        const { categoryId, addedBy, name, icon } = req.body;

        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        // if (loginUser?.data?.role != 'ADMIN') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }

        if (
            !(
                mongoose.Types.ObjectId.isValid(addedBy) &&
                mongoose.Types.ObjectId.isValid(categoryId)
            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }

        if (!(name || icon || addedBy || categoryId)) {
            return res.status(403).send({
                status: 0,
                message: "Required atlist one field",
            });
        }

        const data = await Category.findByIdAndUpdate(
            categoryId,
            {
                $set: {
                    name: name,
                    icon: icon,
                },
            },
            { new: true }
        );

        if (!data) {
            return res.status(404).send({
                status: 0,
                error: "Error in updating product",
                data: [],
            });
        }

        return res.status(200).send({
            status: 1,
            message: "Record updated successfully!",
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

exports.updateCategoryStatus = async (req, res) => {
    try {
        const { categoryId, addedBy } = req.body;

        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        // if (loginUser?.data?.role != 'ADMIN') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }

        if (
            !(
                mongoose.Types.ObjectId.isValid(addedBy) &&
                mongoose.Types.ObjectId.isValid(categoryId)
            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }

        if (!(categoryId || addedBy)) {
            return res
                .status(403)
                .send({ status: 0, message: "All fields are required" });
        }

        const category = await Category.findOne({
            _id: categoryId,
            addedBy: addedBy,
        });

        if (!category) {
            return res.status(404).send({
                status: 0,
                error: "Category not found",
                data: [],
            });
        }

        category.active = !category.active;

        await category.save();

        return res.status(200).send({
            status: 1,
            message: "Category updated successfully!",
            data: category,
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

exports.updateSpecificCategory = async (req, res) => {
    try {
        const { specificCategoryId, addedBy, name, icon } = req.body;

        if (
            !(
                mongoose.Types.ObjectId.isValid(addedBy) &&
                mongoose.Types.ObjectId.isValid(specificCategoryId)
            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }

        if (!(specificCategoryId && addedBy) && !(name || icon)) {
            return res
                .status(403)
                .send({ status: 0, message: "All fields are required" });
        }

        const specificData = await Category.findOneAndUpdate(
            {
                _id: specificCategoryId,
                parentCategoryId: { $ne: null },
                childCategoryId: { $ne: null },
            },
            {
                $set: {
                    name: name,
                    icon: icon,
                },
            },
            {
                new: true,
            }
        );

        if (!specificData) {
            return res
                .status(404)
                .send({ status: 0, message: "Record not found", data: [] });
        }

        return res
            .status(200)
            .send({
                status: 1,
                message: "Record fetched successfully",
                data: specificData,
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

exports.updateSubCategory = async (req, res) => {
    try {
        const { subCategoryId, addedBy, name, icon } = req.body;

        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        // if (loginUser?.data?.role != 'ADMIN') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }

        if (
            !(
                mongoose.Types.ObjectId.isValid(addedBy) &&
                mongoose.Types.ObjectId.isValid(subCategoryId)
            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }

        if (!(name || icon || addedBy || subCategoryId)) {
            return res
                .status(403)
                .send({ status: 0, message: "Required atlist one field" });
        }

        const data = await Category.findOneAndUpdate(
            {
                _id: subCategoryId,
                isDeleted: false,
                parentCategoryId: { $ne: null },
                childCategoryId: { $eq: null },
            },
            {
                $set: {
                    name: name,
                    icon: icon,
                },
            },
            { new: true }
        );

        if (!data) {
            return res.status(403).send({
                status: 0,
                error: "Error in updating product",
                data: [],
            });
        }

        return res.status(200).send({
            status: 1,
            message: "Record updated successfully!",
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

exports.updateSubCategoryStatus = async (req, res) => {
    try {
        const { subCategoryId, addedBy } = req.body;

        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        // if (loginUser?.data?.role != 'ADMIN') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }

        if (
            !(
                mongoose.Types.ObjectId.isValid(addedBy) &&
                mongoose.Types.ObjectId.isValid(subCategoryId)
            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }

        if (!(subCategoryId || addedBy)) {
            return res
                .status(403)
                .send({ status: 0, message: "All fields are required" });
        }

        const subCategory = await Category.findOne({
            _id: subCategoryId,
            addedBy: addedBy,
            parentCategoryId: { $ne: null },
            childCategoryId: { $eq: null },
        });

        if (!subCategory) {
            return res.status(404).send({
                status: 0,
                error: "SubCategory not found",
                data: [],
            });
        }

        subCategory.active = !subCategory.active;

        await subCategory.save();

        return res.status(200).send({
            status: 1,
            message: "Category updated successfully!",
            data: subCategory,
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
