const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");
const validation = require("../middleware/validation");

router.post(
  "/register",
  [
    body("name", "Name cannot be empty").exists(),
    body("email", "Email is required").exists(),
    body("password", "Password must be at least 6 characters").exists(),
  ],
  validation,
  authController.register,
);
router.post(
  "/login",
  [
    body("email", "Email is required").exists(),
    body("password", "Password is required").exists(),
  ],
  validation,
  authController.login,
);

module.exports = router;
