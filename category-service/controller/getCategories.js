const Category = require("model-hook/Model/categoriesModel");
const Admin = require("model-hook/Model/adminModel");
const User = require("model-hook/Model/userModel");
const mongoose = require("mongoose");
const { createApplicationLog } = require("model-hook/common_function/createLog");

exports.getOneCategory = async (req, res) => {
    try {
        const { userId, categoryId } = req.body;

        if (
            !(
                // mongoose.Types.ObjectId.isValid(userId) &&
                mongoose.Types.ObjectId.isValid(categoryId)
            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }

        const { loginUser } = req;
        if (loginUser._id != userId) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin" )) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        const data = await Category.findOne({
            _id: categoryId,
            active: true,
            isDeleted: false,
        });

        if (!data) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }

        await createApplicationLog("Categories", "fetched category", {}, {}, userId);

        return res.status(200).send({
            status: 1,
            message: "Record fetched successfully",
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

exports.getAllCategories = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }
        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        const data = await Category.find({
            active: true,
            isDeleted: false,
            parentCategoryId: { $eq: null },
            childCategoryId: { $eq: null },
        });

        if (!data || data.length === 0) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }

        await createApplicationLog("Categories", "fetched all category", {}, {}, userId);

        return res.status(200).send({
            status: 1,
            message: "Record fetched successfully",
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

exports.getOneSpecificCategory = async (req, res) => {
    try {
        const { userId, specificCategoryId } = req.body;

        if (
            !(
                // mongoose.Types.ObjectId.isValid(userId) &&
                mongoose.Types.ObjectId.isValid(specificCategoryId)
            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }
        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin" )) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        const data = await Category.findOne({
            _id: specificCategoryId,
            active: true,
            isDeleted: false,
            parentCategoryId: { $ne: null },
            childCategoryId: { $ne: null },
        });

        if (!data) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }

        await createApplicationLog("Categories", "fetched one specific category", {}, {}, userId);


        return res.status(200).send({
            status: 1,
            message: "Record fetched successfully",
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

exports.getAllSpecificCategories = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }
        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        const data = await Category.find({
            active: true,
            isDeleted: false,
            parentCategoryId: { $ne: null },
            childCategoryId: { $ne: null },
        });

        if (!data || data.length === 0) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }

        await createApplicationLog("Categories", "fetched all specific category", {}, {}, userId);

        return res.status(200).send({
            status: 1,
            message: "Record fetched successfully",
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

exports.getOneSubCategory = async (req, res) => {
    try {
        const { userId, subCategoryId } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin" )) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        const data = await Category.findOne({
            _id: subCategoryId,
            active: true,
            isDeleted: false,
            parentCategoryId: { $ne: null },
            childCategoryId: { $eq: null },
        });

        if (!data) {
            return res
                .status(404)
                .send({ status: 0, message: "Record not found", data: [] });
        }

        await createApplicationLog("Categories", "fetched one sub category", {}, {}, userId);


        return res
            .status(200)
            .send({
                status: 1,
                message: "Record fetched successfully",
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

exports.getAllSubCategories = async (req, res) => {
    try {
        const { addedBy } = req.body;
        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        const data = await Category.find({
            active: true,
            isDeleted: false,
            parentCategoryId: { $ne: null },
            childCategoryId: { $eq: null },
        });

        if (!data || data.length === 0) {
            return res
                .status(404)
                .send({ status: 0, message: "Record not found", data: [] });
        }

        await createApplicationLog("Categories", "fetched All sub category", {}, {}, addedBy);

        return res
            .status(200)
            .send({
                status: 1,
                message: "Record fetched successfully",
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

exports.getAllCategoriesName = async (req, res) => {
    try {
        const { addedBy } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!mongoose.Types.ObjectId.isValid(addedBy)) {
            return res
                .status(403)
                .send({ status: 0, message: "Invalid request", data: [] });
        }

        const data = await Category.find({
            active: true,
            isDeleted: false,
            parentCategoryId: { $eq: null },
            childCategoryId: { $eq: null },
        });

        if (!data || data.length === 0) {
            return res
                .status(404)
                .send({ status: 0, message: "Record not found", data: [] });
        }

        const name = data.map((data) => {
            return data.name;
        });

        await createApplicationLog("Categories", "fetched all categories name", {}, {}, addedBy);


        return res
            .status(200)
            .send({
                status: 1,
                message: "Record fetched successfully",
                data: name,
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

exports.getAllSubCategoriesName = async (req, res) => {
    try {
        const { addedBy, categoryId } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (
            !(
                mongoose.Types.ObjectId.isValid(addedBy) &&
                mongoose.Types.ObjectId.isValid(categoryId)
            )
        ) {
            return res
                .status(403)
                .send({ status: 0, message: "Invalid request", data: [] });
        }

        const categoryData = await Category.findOne({
            _id: categoryId,
            isDeleted: false,
            active: true,
            parentCategoryId: { $eq: null },
            childCategoryId: { $eq: null },
        });

        if (!categoryData) {
            return res
                .status(404)
                .send({ status: 0, message: "Record not found", data: [] });
        }
        const data = await Category.find({
            active: true,
            isDeleted: false,
            parentCategoryId: { $eq: categoryId },
            childCategoryId: { $eq: null },
        });

        if (!data || data.length === 0) {
            return res
                .status(404)
                .send({ status: 0, message: "Record not found", data: [] });
        }

        const name = data.map((data) => {
            return data.name;
        });

        await createApplicationLog("Categories", "fetched all sub categories name", {}, {}, addedBy);

        return res
            .status(200)
            .send({
                status: 1,
                message: "Record fetched successfully",
                data: name,
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

exports.getAllSpecificCategoriesName = async (req, res) => {
    try {
        const { addedBy, categoryId ,subCategoryId} = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }
        if (
            !(
                mongoose.Types.ObjectId.isValid(addedBy) &&
                mongoose.Types.ObjectId.isValid(categoryId)
            )
        ) {
            return res
                .status(403)
                .send({ status: 0, message: "Invalid request", data: [] });
        }

        const categoryData = await Category.findOne({
            _id: categoryId,
            isDeleted: false,
            active: true,
            parentCategoryId: { $eq: null },
            childCategoryId: { $eq: null },
        });

        if (!categoryData) {
            return res
                .status(404)
                .send({ status: 0, message: "Record not found", data: [] });
        }

         const subCategoryData = await Category.findOne({
            _id: subCategoryId,
            isDeleted: false,
            active: true,
            parentCategoryId: { $eq: categoryId },
            childCategoryId: { $eq: null },
        });

        if (!subCategoryData) {
            return res
                .status(404)
                .send({ status: 0, message: "Record not found", data: [] });
        }
        const data = await Category.find({
            active: true,
            isDeleted: false,
            parentCategoryId: { $eq: categoryId },
            childCategoryId: { $eq: subCategoryId },
        });

        if (!data || data.length === 0) {
            return res
                .status(404)
                .send({ status: 0, message: "Record not found", data: [] });
        }

        const name = data.map((data) => {
            return data.name;
        });


        await createApplicationLog("Categories", "fetched all specific categories name", {}, {}, addedBy);

        return res
            .status(200)
            .send({
                status: 1,
                message: "Record fetched successfully",
                data: name,
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
