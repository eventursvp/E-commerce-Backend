const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema(
    {
        name: { type: String },
        code: { type: String },
        status: { type: Boolean, default: false },
        isPublic: { type: Boolean, default: false },
        discount: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        categoryId: { type: Schema.ObjectId, ref: "Categories" },
        subCategoryId: { type: Schema.ObjectId, ref: "Categories" },
        specificIdCategoryId: { type: Schema.ObjectId, ref: "Categories" },
        brandId: { type: Schema.ObjectId, ref: "Brand" },

        productAvailable: {
            type: String,
            enum: ["STOCK", "OUTOFSTOCK"],
            default: "STOCK",
        },
        variants: [
            {
                sku: { type: String },
                title: { type: String },
                price: { type: Number },
                qty: { type: Number, default: 0 },
                variantAvailable: {
                    type: String,
                    trim: true,
                    enum: ["STOCK", "OUTOFSTOCK"],
                    default: "STOCK",
                },
                variantImage: { type: String },
            },
        ],
        options: [
            {
                name: { type: String },
                values: [],
            },
        ],
        images: [{ type: String }],
        description: { type: String },
        itemDimensions: {
            length: {
                value: {
                    type: Number,
                    required: true,
                },
                unit: {
                    type: String,
                    required: true,
                    enum: ["meter", "centimeter", "millimeter", "inch", "foot"],
                },
            },
            width: {
                value: {
                    type: Number,
                    required: true,
                },
                unit: {
                    type: String,
                    required: true,
                    enum: ["meter", "centimeter", "millimeter", "inch", "foot"],
                },
            },
            height: {
                value: {
                    type: Number,
                    required: true,
                },
                unit: {
                    type: String,
                    required: true,
                    enum: ["meter", "centimeter", "millimeter", "inch", "foot"],
                },
            },
        },
        packageDimensions: {
            length: {
                value: {
                    type: Number,
                    required: true,
                },
                unit: {
                    type: String,
                    required: true,
                    enum: ["meter", "centimeter", "millimeter", "inch", "foot"],
                },
            },
            width: {
                value: {
                    type: Number,
                    required: true,
                },
                unit: {
                    type: String,
                    required: true,
                    enum: ["meter", "centimeter", "millimeter", "inch", "foot"],
                },
            },
            height: {
                value: {
                    type: Number,
                    required: true,
                },
                unit: {
                    type: String,
                    required: true,
                    enum: ["meter", "centimeter", "millimeter", "inch", "foot"],
                },
            },
        },
        manufacturer: { type: String },
        modelNumber: {
            type: String,
        },
        releaseDate: {
            type: Date,
        },
        productWeight: {
          value: {
            type: Number
        },
        unit: {
            type: String,
            enum: ['kilogram', 'gram', 'pound', 'tons']
        }
        },
        materialType:{
          type: String
        },
        countryOfOrigin:{
          type:String
        },
        expirationDate: {
          type: Date
      },

        //Book Schema
        author:{type:String},
        publisher:{type:String},
        language:{type:String},

        isDeleted: { type: Boolean, default: false },
        addedBy: { type: Schema.ObjectId, ref: "Admin" },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", Product, "Product");
