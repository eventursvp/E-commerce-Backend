const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Categories = new Schema({
    name: { type: String, trim: true, required: true, index: true },
    icon: { type: String },
    active: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    parentCategoryId: { type: Schema.ObjectId, ref: 'Categories', default: null },
    childCategoryId: { type: Schema.ObjectId, ref: 'Categories', default: null },
    addedBy: { type: Schema.ObjectId, ref: 'Admin' },
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Categories', Categories,'Categories');