const Category = require("model-hook/Model/categoriesModel");
const Admin = require("model-hook/Model/adminModel");
const mongoose = require("mongoose");
const { createApplicationLog } = require("model-hook/common_function/createLog");


exports.addCategory = async (req, res) => {
    try {
        const { name, icon, addedBy } = req.body;
        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin" )) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (!mongoose.Types.ObjectId.isValid(addedBy)) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }

        if (!(name && icon && addedBy)) {
            return res.status(403).send({ status: 0, message: "All fields are required" });
        }

        const alreadyExist = await Category.findOne({addedBy:addedBy,name:name});

        if(alreadyExist){
            return res.status(409).send({status:0,message:"Record already exist",data:[]})
        }
        const categoryData = {
            name,
            icon,
            addedBy,
        };
        const data = await new Category(categoryData).save();
        if (!data) {
            return res.status(403).send({
                status: 0,
                error: "Error in creating product",
                data: [],
            });
        }

        await createApplicationLog("Category", "add category", {}, {}, addedBy);

        return res.status(201).send({
            status: 1,
            message: "Record added successfully!",
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


exports.addSubCategory = async (req, res) => {
    try {
        const { name, icon, addedBy,parentCategoryId } = req.body;
        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin" )) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (!mongoose.Types.ObjectId.isValid(addedBy)) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }

        if (!(name && icon && addedBy && parentCategoryId)) {
            return res.status(403).send({ status: 0, message: "All fields are required" });
        }

        const alreadyExist = await Category.findOne({addedBy:addedBy,name:name});

        if(alreadyExist){
            return res.status(409).send({status:0,message:"Record already exist",data:[]})
        }
        const subCategoryData = {
            name,
            icon,
            addedBy,
            parentCategoryId
        };
        const data = await new Category(subCategoryData).save();
        if (!data) {
            return res.status(403).send({
                status: 0,
                error: "Error in creating product",
                data: [],
            });
        }

        await createApplicationLog("SubCategory", "add sub category", {}, {}, addedBy);


        return res.status(200).send({
            status: 1,
            message: "Record added successfully!",
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


exports.addSpecificCategory = async (req, res) => {
    try {
        const { name, icon, addedBy, parentCategoryId, childCategoryId } =
            req.body;

            const { loginUser } = req;
            if (loginUser._id != addedBy) {
                return res.status(401).send({ message: "Unauthorized access."});
            }
    
            if (!(loginUser?.role === "Admin" )) {
                return res.status(403).send({ status: 0, message: "Unauthorized access."});
            }

        if (
            !(
                mongoose.Types.ObjectId.isValid(addedBy) &&
                mongoose.Types.ObjectId.isValid(parentCategoryId) &&
                mongoose.Types.ObjectId.isValid(childCategoryId)
            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }

        if (!(name && icon && addedBy && parentCategoryId && childCategoryId)) {
            return res.status(403).send({ status: 0, message: "All fields are required" });
        }

        const parentCategoryData = await Category.findOne({
            _id: parentCategoryId,
            active: true,
            isDeleted: false,
            parentCategoryId:{$eq:null},
            childCategoryId:{$eq:null}
        });

        const childCategoryData = await Category.findOne({
            _id: childCategoryId,
            active: true,
            isDeleted: false,
            parentCategoryId:{$ne:null},
            childCategoryId:{$eq:null}
        });

        if (!(parentCategoryData || childCategoryData)) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }

        const alreadyExist = await Category.findOne({addedBy:addedBy,name:name});

        if(alreadyExist){
            return res.status(409).send({status:0,message:"Record already exist",data:[]})
        }
        const specificCategoryData = {
            name,
            icon,
            addedBy,
            parentCategoryId,
            childCategoryId,
        };
        const data = await new Category(specificCategoryData).save();
        if (!data) {
            return res.status(403).send({
                status: 0,
                error: "Error in creating product",
                data: [],
            });
        }

        await createApplicationLog("SpecificCategory", "add specific category", {}, {}, addedBy);

        return res.status(201).send({
            status: 1,
            message: "Record added successfully!",
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

