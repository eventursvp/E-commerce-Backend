const mongoose = require('mongoose');

const BlogsSchema = new mongoose.Schema({
    title: { type: String, required: true, maxlength: 50 },
    description: { type: String, required: true },
    blogImages: [{ type: String, required: true }],
    blogCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "BlogCategories", required: true },
    likes: { type: Number, default: 0 },
    comment: { type: Number, default: 0 },
    share: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["Published", "Draft"],
        default: "Draft",
    },
    isDeleted: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const Blogs = mongoose.model("Blogs", BlogsSchema, "Blogs");

module.exports = Blogs;
