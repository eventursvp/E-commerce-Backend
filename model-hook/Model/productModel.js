const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    name: { type: String },
    code: { type: String },
    status: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    categoryId: { type: Schema.ObjectId, ref: 'Categories' },
    subCategoryId: { type: Schema.ObjectId, ref: 'SubCategories' },
    specificIdCategoryId: { type: Schema.ObjectId, ref: 'Categories' },
    brandId: { type: Schema.ObjectId, ref: 'Brand' },

    productAvailable: {
        type: String,
        enum: ["STOCK","OUTOFSTOCK"],
        default: "STOCK"
    },
    variants: [
        {
            sku: { type: String },
            title: { type: String },
            price: { type: Number },
            qty: { type: Number, default: 0 },
            variantAvailable: {
                type: String, trim: true,
                enum: ["STOCK","OUTOFSTOCK"],
                default: "STOCK"
            },
            variantImage: { type: String }

        }
    ],
    options: [
        {
            name: { type: String },
            values: []
        }
    ],
    images: [{ type: String }],
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
    addedBy: { type: Schema.ObjectId ,ref:'Admin'},
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', Product,'Product');