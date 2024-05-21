const mongoose = require("mongoose")
const fs = require("fs")
const Blogs = require("model-hook/Model/blogModel")
const BlogCategories = require("model-hook/Model/blogCategoriesModel")

exports.updateBlog = async (req, res, next) => {
    try {
        const { userId, blogId, title, description, blogCategoryId } = req.body
        const blogImages = req?.files?.blogImages
        const { loginUser } = req

        if (!userId) {
            await removeImage(blogImages)
            return res.status(400).send({ status: 0, message: "User Id is required." })
        }
        if (!mongoose.isValidObjectId(userId)) {
            await removeImage(blogImages)
            return res.status(400).send({ status: 0, message: "Invalid user id." });
        }
        if (loginUser?._id != userId || loginUser?.role !== "Admin") {
            await removeImage(blogImages)
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }

        if (!blogId) {
            await removeImage(blogImages)
            return res.status(400).send({ status: 0, message: "Blog id is required." })
        }
        if (!mongoose.isValidObjectId(blogId)) {
            await removeImage(blogImages)
            return res.status(400).send({ status: 0, message: "Invalid blog id." })
        }
        const checkBlog = await Blogs.findOne({ _id: blogId, isDeleted: false })
        if (!checkBlog) {
            await removeImage(blogImages)
            return res.status(404).send({ status: 0, message: "Blog not found with given id." })
        }

        let updatedObj = {}

        if (title) {
            if (title.length > 50) {
                await removeImage(blogImages)
                return res.status(400).send({ status: 0, message: "Maximum 50 character allow into title." })
            }
            updatedObj.title = title
        }

        if (description) {
            updatedObj.description = description
        }

        let urlOfBlogImages = []
        if (blogImages && blogImages.length > 0) {
            urlOfBlogImages = await blogImages.map((data) => {
                return `http://192.168.1.16:5010/upload/${data.filename}`
            })
        }
        if (urlOfBlogImages.length > 0) {
            updatedObj.blogImages = urlOfBlogImages
        }

        if (blogCategoryId) {
            if (!mongoose.isValidObjectId(blogCategoryId)) {
                await removeImage(blogImages)
                return res.status(400).send({ status: 0, message: "Invalid blog category id." })
            }
            const checkBlogCategory = await BlogCategories.findOne({ _id: blogCategoryId })
            if (!checkBlogCategory) {
                await removeImage(blogImages)
                return res.status(404).send({ status: 0, message: "Blog category not found with given id." })
            }
            updatedObj.blogCategoryId = blogCategoryId
        }

        const updateBlog = await Blogs.findOneAndUpdate({ _id: blogId, userId: userId, isDeleted: false }, updatedObj, { new: true })

        if (updateBlog) {
            return res.status(201).send({ status: 1, message: "Blog is updated", data: updateBlog })
        }
        return res.status(500).send({ status: 0, message: "Blog not updated, Please try again." })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}


const removeImage = (blogImages) => {
    const currentDirectory = './upload';
    if (blogImages && blogImages.length > 0) {
        blogImages.forEach(async (profileImage) => {
            const imagePath = profileImage ? `${currentDirectory}/${profileImage?.filename}` : null;
            if (imagePath) {
                await fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Error deleting image:', err);
                    } else {
                        console.log('Image deleted successfully');
                    }
                });
            }
        })
    }
}