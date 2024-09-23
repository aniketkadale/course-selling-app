const express = require("express");
const router = express.Router();
const { userAuthMiddlware } = require("../middlewares/userAuthMiddleware");
const { handleGetCoursePreview, handleCoursePurchase } = require('../controllers/courseController');


router.get("/preview", handleGetCoursePreview);

router.post("/purchase", userAuthMiddlware, handleCoursePurchase);

module.exports = router;
