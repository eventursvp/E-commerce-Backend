const express = require("express");
const { jwtValidation } = require("model-hook/middleware/jwtValidation")

const router = express.Router();

const {
    addCategory,
    addSpecificCategory,
    addSubCategory,
} = require("../controller/addCategory");
const {
    updateCategory,
    updateCategoryStatus,
    updateSpecificCategory,
    updateSubCategory,
    updateSubCategoryStatus
} = require("../controller/updateCategories");
const {
    getOneCategory,
    getAllCategories,
    getOneSpecificCategory,
    getAllSpecificCategories,
    getOneSubCategory,
    getAllSubCategories,
    getAllCategoriesName,
    getAllSubCategoriesName,
    getAllSpecificCategoriesName
} = require("../controller/getCategories");
const {
    removeCategory,
    removeSubCategory,
    removeSpecificCategory,
} = require("../controller/removeCategory");


//ParentCategory
router.post("/addCategory",jwtValidation, addCategory);
router.post("/updateCategory",jwtValidation, updateCategory);
router.post("/updateCategoryStatus", jwtValidation,updateCategoryStatus);
router.post("/getOneCategory", jwtValidation,getOneCategory);
router.post("/getAllCategories",jwtValidation, getAllCategories);
router.post("/removeCategory", jwtValidation,removeCategory);
router.post("/getAllCategoriesName",jwtValidation, getAllCategoriesName);



//ChildCategory
router.post("/addSubCategory", jwtValidation,addSubCategory);
router.post("/getOneSubCategory", jwtValidation,getOneSubCategory);
router.post("/getAllSubCategories",jwtValidation, getAllSubCategories);
router.post('/removeSubCategory',jwtValidation,removeSubCategory);
router.post('/updateSubCategory',jwtValidation,updateSubCategory);
router.post('/updateSubCategoryStatus',jwtValidation,updateSubCategoryStatus);
router.post('/getAllSubCategoriesName',jwtValidation,getAllSubCategoriesName);



//Specific Category
router.post("/addSpecificCategory", jwtValidation,addSpecificCategory);
router.post("/updateSpecificCategory",jwtValidation, updateSpecificCategory);
router.post("/getOneSpecificCategory",jwtValidation, getOneSpecificCategory);
router.post("/getAllSpecificCategories",jwtValidation, getAllSpecificCategories);
router.post("/removeSpecificCategory", jwtValidation,removeSpecificCategory);
router.post("/getAllSpecificCategoriesName",jwtValidation, getAllSpecificCategoriesName);



module.exports = router;