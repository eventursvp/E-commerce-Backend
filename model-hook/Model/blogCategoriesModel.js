const mongoose = require('mongoose');

const blogCategoriesSchema = new mongoose.Schema({
    categoryName: { type: String, required: true, maxlength: 50 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const BlogCategories = mongoose.model('BlogCategories', blogCategoriesSchema, 'BlogCategories');

module.exports = BlogCategories