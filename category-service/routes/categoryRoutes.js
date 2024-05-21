const express = require("express");

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
router.post("/addCategory", addCategory);
router.post("/updateCategory", updateCategory);
router.post("/updateCategoryStatus", updateCategoryStatus);
router.post("/getOneCategory", getOneCategory);
router.post("/getAllCategories", getAllCategories);
router.post("/removeCategory", removeCategory);
router.post("/getAllCategoriesName", getAllCategoriesName);



//ChildCategory
router.post("/addSubCategory", addSubCategory);
router.post("/getOneSubCategory", getOneSubCategory);
router.post("/getAllSubCategories", getAllSubCategories);
router.post('/removeSubCategory',removeSubCategory);
router.post('/updateSubCategory',updateSubCategory);
router.post('/updateSubCategoryStatus',updateSubCategoryStatus);
router.post('/getAllSubCategoriesName',getAllSubCategoriesName);



//Specific Category
router.post("/addSpecificCategory", addSpecificCategory);
router.post("/updateSpecificCategory", updateSpecificCategory);
router.post("/getOneSpecificCategory", getOneSpecificCategory);
router.post("/getAllSpecificCategories", getAllSpecificCategories);
router.post("/removeSpecificCategory", removeSpecificCategory);
router.post("/getAllSpecificCategoriesName", getAllSpecificCategoriesName);




module.exports = router;
