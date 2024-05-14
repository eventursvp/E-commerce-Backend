const Category = require("model-hook/Model/categoriesModel");
const Admin = require("model-hook/Model/adminModel");
const User = require("model-hook/Model/adminModel");
const mongoose = require("mongoose");

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

        // const { loginUser } = req;
        // if (loginUser?.data?._id != userId) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }

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

        if (
            !(
                mongoose.Types.ObjectId.isValid(userId)
            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }
        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }

        const data = await Category.find({ active: true, isDeleted: false,parentCategoryId:{$eq:null},
            childCategoryId:{$eq:null}, });

        if (!data || data.length === 0) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }

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
        // const { loginUser } = req;
        // if (loginUser?.data?._id != userId) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }

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

        if (
            !(
                mongoose.Types.ObjectId.isValid(userId)
            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }
        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }

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


exports.getOneSubCategory = async(req,res)=>{
    try {
        const {userId,subCategoryId} = req.body

         // const { loginUser } = req;
        // if (loginUser?.data?._id != userId) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }

        const data = await Category.findOne({_id:subCategoryId,active:true,isDeleted:false,parentCategoryId:{$ne:null},childCategoryId:{$eq:null}});

        if(!data){
            return res.status(404).send({status:0,message:"Record not found",data:[]})
        }

        return res.status(200).send({status:1,message:"Record fetched successfully",data:data})

    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
}


exports.getAllSubCategories = async(req,res)=>{
    try {
        const {userId} = req.body
         // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }

        const data = await Category.find({active:true,isDeleted:false,parentCategoryId:{$ne:null},childCategoryId:{$eq:null}});

        if(!data || data.length === 0){
            return res.status(404).send({status:0,message:"Record not found",data:[]})
        }

        return res.status(200).send({status:1,message:"Record fetched successfully",data:data})
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
}