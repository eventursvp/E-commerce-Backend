const mongoose = require("mongoose")

const blogShareSchema = new mongoose.Schema({
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true })

const BlogShare = mongoose.model("BlogShare", blogShareSchema, "BlogShare")

module.exports = BlogShare