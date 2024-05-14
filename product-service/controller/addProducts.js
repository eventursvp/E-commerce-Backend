const Product = require("model-hook/Model/productModel");
const Admin = require("model-hook/Model/adminModel");
const Categories = require("model-hook/Model/categoriesModel");
const SubCategories = require("model-hook/Model/subCategories");

const mongoose = require("mongoose");


exports.addProduct = async (req, res) => {
    try {
        const {
            name,
            code,
            discount,
            tax,
            variants,
            options,
            images,
            description,
            addedBy,
            categoryId,
            subCategoryId,
            specificIdCategoryId,
            brandId,
        } = req.body;

        if (
            !(
                mongoose.Types.ObjectId.isValid(addedBy) &&
                mongoose.Types.ObjectId.isValid(brandId) &&
                mongoose.Types.ObjectId.isValid(categoryId) &&
                mongoose.Types.ObjectId.isValid(subCategoryId) &&
                mongoose.Types.ObjectId.isValid(specificIdCategoryId) 
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
        // if (loginUser?.data?.role != 'ADMIN') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }
        if (
            !(
                name ||
                code ||
                discount ||
                tax ||
                variants ||
                images ||
                description ||
                addedBy ||
                brandId ||
                categoryId ||
                subCategoryId ||
                specificIdCategoryId
            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "All fields are required",
                data: [],
            });
        }

        const categoriesData = await Categories.findOne({
            _id: categoryId,
            active: true,
            isDeleted: false,
        });

        if (!categoriesData) {
            return res.status(404).send({
                status: 0,
                message: "Category not found",
                data: [],
            });
        }

        const SubCategoriesData = await SubCategories.findOne({
            _id: subCategoryId,
            active: true,
            isDeleted: false,
        });

        if (!SubCategoriesData) {
            return res.status(404).send({
                status: 0,
                message: "SubCategory not found",
                data: [],
            });
        }

        if (variants && Array.isArray(variants) && variants.length > 0) {
            const variant = variants[0];
            if (
                !variant.sku ||
                !variant.title ||
                !variant.price ||
                !variant.qty ||
                !variant.variantImage
            ) {
                return res.status(403).send({
                    status: 0,
                    message: "Variant fields are required",
                    data: [],
                });
            }
        }

        const productData = {
            name,
            code,
            discount,
            tax,
            variants,
            options,
            images,
            description,
            addedBy,
            categoryId,
            subCategoryId,
            brandId,
            specificIdCategoryId
        };

        const data = await new Product(productData).save();

        if (!data) {
            return res.status(403).send({
                status: 0,
                error: "Error in creating product",
                data: [],
            });
        }

        return res.status(201).send({
            status: 1,
            message: "Record added successfully!",
            data: data,
        });
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(403).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
};


exports.publishProduct = async(req,res)=>{
    try {
        const {addedBy,productId} = req.body

         // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        // if (loginUser?.data?.role != 'ADMIN') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }

        if(!(addedBy && productId)){
            return res.status(403).send({status:0,message:"All fields are required",data:[]})
        }

        const data = await Product.findByIdAndUpdate({_id:productId},{$set:{isPublic:true}},{new:true});

        if(!data){
            return res.status(404).send({status:0,message:"Record not found",data:[]})
        }
        return res.status(200).send({status:1,message:"Record updated successfull",data:data})
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
}
