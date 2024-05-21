const Product = require("model-hook/Model/productModel");
const Admin = require("model-hook/Model/adminModel");
const Categories = require("model-hook/Model/categoriesModel");

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
            itemDimensions,
            packageDimensions,
            addedBy,
            categoryId,
            subCategoryId,
            specificIdCategoryId,
            brandId,
            manufacturer ,
            modelNumber ,
            releaseDate ,
            productWeight,
            materialType,
            countryOfOrigin,
            expirationDate,
            manufacturerContact,
            packer
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
                name &&
                code &&
                discount &&
                tax &&
                variants &&
                images &&
                description &&
                itemDimensions &&
                packageDimensions &&
                addedBy &&
                brandId &&
                categoryId &&
                subCategoryId &&
                specificIdCategoryId &&
                manufacturer &&
                modelNumber &&
                releaseDate &&
                productWeight &&
                materialType &&
                countryOfOrigin &&
                manufacturerContact &&
                packer
            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "All fields are required",
                data: [],
            });
        }

        const validUnits = ["meter", "centimeter", "millimeter", "inch", "foot"];

        const validWeightUnits = ["kilogram", "gram", "pound", "tons"];


        if (
            !itemDimensions.length?.value ||
            !itemDimensions.width?.value ||
            !itemDimensions.height?.value ||
            !itemDimensions.length?.unit ||
            !itemDimensions.width?.unit ||
            !itemDimensions.height?.unit ||
            itemDimensions.length.value <= 0 ||
            itemDimensions.width.value <= 0 ||
            itemDimensions.height.value <= 0 ||
            !validUnits.includes(itemDimensions.length.unit) ||
            !validUnits.includes(itemDimensions.width.unit) ||
            !validUnits.includes(itemDimensions.height.unit)
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid item dimensions",
                data: [],
            });
        }

        // Validate packageDimensions
        if (
            !packageDimensions.length?.value ||
            !packageDimensions.width?.value ||
            !packageDimensions.height?.value ||
            !packageDimensions.length?.unit ||
            !packageDimensions.width?.unit ||
            !packageDimensions.height?.unit ||
            packageDimensions.length.value <= 0 ||
            packageDimensions.width.value <= 0 ||
            packageDimensions.height.value <= 0 ||
            !validUnits.includes(packageDimensions.length.unit) ||
            !validUnits.includes(packageDimensions.width.unit) ||
            !validUnits.includes(packageDimensions.height.unit)
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid package dimensions",
                data: [],
            });
        }

          // Validate productWeight
          if (
            !productWeight.value ||
            !productWeight.unit ||
            productWeight.value <= 0 ||
            !validWeightUnits.includes(productWeight.unit)
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid product weight",
                data: [],
            });
        }

        const categoriesData = await Categories.findOne({
            _id: categoryId,
            active: true,
            isDeleted: false,
            parentCategoryId:{$eq:null},
            childCategoryId:{$eq:null}
        });

        if (!categoriesData) {
            return res.status(404).send({
                status: 0,
                message: "Category not found",
                data: [],
            });
        }

        const SubCategoriesData = await Categories.findOne({
            _id: subCategoryId,
            active: true,
            isDeleted: false,
            parentCategoryId:{$ne:null},
            childCategoryId:{$eq:null}
        });

        if (!SubCategoriesData) {
            return res.status(404).send({
                status: 0,
                message: "SubCategory not found",
                data: [],
            });
        }


        const SpecificCategoriesData = await Categories.findOne({
            _id: specificIdCategoryId,
            active: true,
            isDeleted: false,
            parentCategoryId:{$ne:null},
            childCategoryId:{$ne:null}
        });

        if (!SpecificCategoriesData) {
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

        let productData ={}
        if(categoriesData.name === "Beauty"){
                productData={
                    name,
                    code,
                    discount,
                    tax,
                    variants,
                    options,
                    images,
                    description,
                    itemDimensions,
                    packageDimensions,
                    addedBy,
                    categoryId,
                    subCategoryId,
                    brandId,
                    specificIdCategoryId,
                    manufacturer ,
                    modelNumber ,
                    releaseDate ,
                    productWeight,
                    materialType,
                    countryOfOrigin,
                    expirationDate,
                    manufacturerContact,
                    packer
                }
        } else if(categoriesData.name === "toy"){
            productData = {
                name,
                code,
                discount,
                tax,
                variants,
                options,
                images,
                description,
                itemDimensions,
                packageDimensions,
                addedBy,
                categoryId,
                subCategoryId,
                brandId,
                specificIdCategoryId,
                manufacturer ,
                modelNumber ,
                releaseDate ,
                productWeight,
                materialType,
                countryOfOrigin,
                manufacturerContact,
                packer
            };
        } else{
            productData={
                name,
                code,
                discount,
                tax,
                variants,
                options,
                images,
                description,
                itemDimensions,
                packageDimensions,
                addedBy,
                categoryId,
                subCategoryId,
                brandId,
                specificIdCategoryId,
                manufacturer ,
                modelNumber ,
                releaseDate ,
                productWeight,
                materialType,
                countryOfOrigin,
                expirationDate,
                manufacturerContact,
                packer
            }
        }
         

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
