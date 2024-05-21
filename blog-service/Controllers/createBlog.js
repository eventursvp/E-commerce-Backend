const mongoose = require("mongoose")
const fs = require("fs")
const Blogs = require("model-hook/Model/blogModel")
const { constants } = require("model-hook/common_function/constants")
const BlogCategories = require("model-hook/Model/blogCategoriesModel")

exports.createBlog = async (req, res, next) => {
    try {
        const { userId, title, description, status, blogCategoryId } = req.body
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

        if (!title) {
            await removeImage(blogImages)
            return res.status(400).send({ status: 0, message: "Title is required." })
        }
        if (title.length > 50) {
            await removeImage(blogImages)
            return res.status(400).send({ status: 0, message: "Maximum 50 character allow into title." })
        }
        const checkTitle = await Blogs.findOne({ title: title })
        if (checkTitle) {
            await removeImage(blogImages)
            return res.status(400).send({ status: 0, message: "Blog with this title is already exists into your blog list." })
        }

        if (!description) {
            await removeImage(blogImages)
            return res.status(400).send({ status: 0, message: "Description is required." })
        }

        if (!status) {
            await removeImage(blogImages)
            return res.status(400).send({ status: 0, message: "Status is required." })
        }
        if (!["Published", "Draft"].includes(status)) {
            await removeImage(blogImages)
            return res.status(400).send({ status: 0, message: "Invalid status." })
        }

        if (!blogCategoryId) {
            await removeImage(blogImages)
            return res.status(400).send({ status: 0, message: "Blog Category id is required." })
        }
        if (!mongoose.isValidObjectId(blogCategoryId)) {
            await removeImage(blogImages)
            return res.status(400).send({ status: 0, message: "Invalid blog category id." })
        }
        const checkBlogCategory = await BlogCategories.findOne({ _id: blogCategoryId })
        if (!checkBlogCategory) {
            await removeImage(blogImages)
            return res.status(404).send({ status: 0, message: "Blog category not found with given id." })
        }

        let urlOfBlogImages = []
        if (blogImages && blogImages.length > 0) {
            urlOfBlogImages = await blogImages.map((data) => {
                return `http://192.168.1.16:5010/upload/${data.filename}`
            })
        }

        const createBlog = await Blogs.create({
            title,
            description,
            blogImages: urlOfBlogImages,
            status,
            userId,
            blogCategoryId
        })

        if (createBlog) {
            return res.status(201).send({ status: 1, message: "Blog is created", data: createBlog })
        }
        return res.status(500).send({ status: 0, message: "Blog not created, Please try again." })

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