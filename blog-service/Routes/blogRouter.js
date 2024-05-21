const express = require("express");
const router = express.Router();
const multer = require("multer")
const { jwtValidation } = require("model-hook/middleware/jwtValidation")
const { addBlogCategory } = require("../Controllers/addBlogCategory")
const { getOneBlogCategory } = require("../Controllers/getOneBlogCategory")
const { getAllBlogCategories } = require("../Controllers/getAllBlogCategories")
const { updateBlogCategory } = require("../Controllers/updateBlogCategory")
const { deleteBlogCategory } = require("../Controllers/deleteBlogCategory")
const { createBlog } = require("../Controllers/createBlog")
const { getAllBlogForUser, getAllBlogForAdmin } = require("../Controllers/getAllBlog")
const { getAllRemovedBlogs } = require("../Controllers/getAllRemovedBlogs")
const { getOneBlog } = require("../Controllers/getOneBlog")
const { removeBlog, deleteBlog } = require("../Controllers/removeBlog")
const { updateBlog } = require("../Controllers/updateBlog")
const { publishBlog } = require("../Controllers/publishBlog")
const { likeBlog } = require("../Controllers/likeBlog")
const { userListOfLikedBlog } = require("../Controllers/userListOfLikedBlog")
const { addCommentOnBlog } = require("../Controllers/addCommentOnBlog")
const { updateComment } = require("../Controllers/updateComment")
const { getChildComment } = require("../Controllers/getChildComment")
const { getAllCommentsOfBlog } = require("../Controllers/getAllCommentsOfBlog")
const { deleteComment } = require("../Controllers/deleteComment")
const { giveLikeToComment } = require("../Controllers/giveLikeToComment")
const { shareBlog } = require("../Controllers/shareBlog")
const { userListOfSharedBlog } = require("../Controllers/userListOfSharedBlog")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/ /g, '_'));
    },
})

const upload = multer({ storage: storage }).fields([
    { name: "blogImages", maxCount: 20 }
])

const handleMulterErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).send({ status: 0, message: 'You can upload up to 20 images only' });
        }
        return res.status(400).send({ error: err.message });
    } else if (err) {
        return res.status(500).send({ error: err.message });
    }
    next();
};

router.post("/addBlogCategory", jwtValidation, addBlogCategory)
router.post("/getAllBlogCategories", jwtValidation, getAllBlogCategories)
router.post("/getOneBlogCategory", jwtValidation, getOneBlogCategory)
router.post("/updateBlogCategory", jwtValidation, updateBlogCategory)
router.post("/deleteBlogCategory", jwtValidation, deleteBlogCategory)

router.post("/createBlog", jwtValidation, (req, res, next) => {
    upload(req, res, function (err) {
        handleMulterErrors(err, req, res, next);
    });
}, createBlog);
router.post("/getAllBlogForUser", getAllBlogForUser)
router.post("/getAllBlogForAdmin", jwtValidation, getAllBlogForAdmin)
router.post("/getAllRemovedBlogs", jwtValidation, getAllRemovedBlogs)
router.post("/getOneBlog", jwtValidation, getOneBlog)
router.post("/removeBlog", jwtValidation, removeBlog)
router.post("/deleteBlog", jwtValidation, deleteBlog)
router.post("/updateBlog", jwtValidation, (req, res, next) => {
    upload(req, res, function (err) {
        handleMulterErrors(err, req, res, next);
    });
}, updateBlog);

router.post("/publishBlog", jwtValidation, publishBlog)
router.post("/likeBlog", jwtValidation, likeBlog)
router.post("/userListOfLikedBlog", jwtValidation, userListOfLikedBlog)

router.post("/addCommentOnBlog", jwtValidation, addCommentOnBlog)
router.post("/updateComment", jwtValidation, updateComment)
router.post("/getChildComment", jwtValidation, getChildComment)
router.post("/getAllCommentsOfBlog", jwtValidation, getAllCommentsOfBlog)
router.post("/deleteComment", jwtValidation, deleteComment)
router.post("/giveLikeToComment", jwtValidation, giveLikeToComment)

router.post("/shareBlog", jwtValidation, shareBlog)
router.post("/userListOfSharedBlog", jwtValidation, userListOfSharedBlog)

module.exports = router
