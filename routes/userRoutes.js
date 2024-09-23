require("dotenv").config();
const express = require("express");
const router = express.Router();
const { userAuthMiddlware } = require("../middlewares/userAuthMiddleware");
const handleZodValidation = require('../zodValidation');
const {
  handleUserSignup,
  handleUserLogin,
  handleUserPurchases,
} = require("../controllers/userController");


router.post("/signup", handleZodValidation, handleUserSignup);

router.post("/login", handleUserLogin);

router.get("/purchases", userAuthMiddlware, handleUserPurchases);

module.exports = router;
