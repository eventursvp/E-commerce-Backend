// const mongoose = require("mongoose")

// const blogCommentsSchema = new mongoose.Schema({
//     blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blogs", required: true },
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     comment: { type: String, required: true },
//     likesUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
// }, {
//     timestamps: true
// })

// const BlogComments = mongoose.model("BlogComments", blogCommentsSchema, "BlogComments")

// module.exports = BlogComments


const mongoose = require("mongoose")

const blogCommentsSchema = new mongoose.Schema({
    type: { type: String, Enumerator: ["Parent", "Child"] },
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blogs", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true, maxlength: 200 },
    likesUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    childBlogCommentId: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogComments" }]
}, {
    timestamps: true
})

const BlogComments = mongoose.model("BlogComments", blogCommentsSchema, "BlogComments")

module.exports = BlogComments

