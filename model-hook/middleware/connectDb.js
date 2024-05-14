const mongoose = require("mongoose");
require("dotenv").config();

const Admin = require("../Model/adminModel");
const Banner = require("../Model/bannerModel");
const Blog = require("../Model/blogModel");
const Brand = require("../Model/brandModel");
const Cart = require("../Model/cartModel");

const Categories = require("../Model/categoriesModel");
const Order = require("../Model/orderModel");
const Offer = require("../Model/offerModel");
const Product = require("../Model/productModel");
const RecentViewedProducts = require("../Model/recentViewedProduct");

const SubCategories = require("../Model/subCategories");
const User = require("../Model/userModel");
const Wishlist = require("../Model/wishlistModel");
const WishlistCollection = require("../Model/wishlistCollectionModel");


mongoose.set("strictQuery", false);


const DB_URL =
    "mongodb+srv://eventu:39lzaVMNq8bO8m3V@cluster0.pdxma2k.mongodb.net/E-Commerce";

if (!DB_URL) {
    console.error("Database URL is not defined.");
    process.exit(1); // Exit with error
}

// Connect to MongoDB
mongoose
    .connect(DB_URL)
    .then(() => {
        console.log("Database Connected Successfully!");
    })
    .catch((err) => {
        console.error("Error in Connecting Database:", err);
        process.exit(1); // Exit with error
    });
