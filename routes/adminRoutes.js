const express = require("express");
const router = express.Router();
const { handleAdminSignup, handleAdminLogin, handleCreateCourse, handleUpdateCourse, handleGetBulkCourses } = require('../controllers/adminController')
const handleZodValidation = require('../zodValidation');
const { adminAuthMiddleware } = require("../middlewares/adminAuthMiddleware");


router.post("/signup", handleZodValidation, handleAdminSignup);

router.post("/login", handleAdminLogin);

// create a new course as admin
router.post("/course", adminAuthMiddleware, handleCreateCourse);

// update course as admin
router.put("/course", adminAuthMiddleware, handleUpdateCourse);

router.get("/course/bulk", adminAuthMiddleware, handleGetBulkCourses);

module.exports = router;
