const Product = require("model-hook/Model/productModel");
const Admin = require("model-hook/Model/adminModel");

exports.updateProduct = async (req, res) => {
    try {
        const {
            name,
            code,
            discount,
            tax,
            variants,
            images,
            description,
            addedBy,
            productId
        } = req.body;

        if(!(mongoose.Types.ObjectId.isValid(productId) && mongoose.Types.ObjectId.isValid(addedBy))){
            return res.status(403).send({status:0,message:"Invalid request",data:[]})
        }

        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        // if (loginUser?.data?.role != 'ADMIN') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }       

        if (variants && Array.isArray(variants) && variants.length > 0) {
            const variant = variants[0]; 
            if (!variant.sku || !variant.title || !variant.price || !variant.qty || !variant.variantImage) {
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
            images,
            description,
            addedBy,
        };

        const data = await Product.findOne({_id:productId,isDeleted:false});

        if(!data){
            return res.status(404).send({status:0,message:"Record not found",data:[]})
        }
        const updatedProduct = await Product.findByIdAndUpdate({productId:productId,addedBy:addedBy}, productData, { new: true });

        if (!updatedProduct) {
            return res.status(404).send({
                status: 0,
                error: "Product not found or error in updating",
                data: [],
            });
        }

        return res.status(200).send({
            status: 1,
            message: "Product updated successfully",
            // data: updatedProduct,
        });
    } catch (error) {
        console.error("Catch Error:", error);
        return res.status(500).status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
};
