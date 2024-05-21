const mongoose = require("mongoose")

const blogLikesSchema = new mongoose.Schema({
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true })

const BlogLikes = mongoose.model("BlogLikes", blogLikesSchema, "BlogLikes")

module.exports = BlogLikes