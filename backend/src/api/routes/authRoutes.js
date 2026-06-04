const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const validateRequest = require("../../middleware/validateRequest");
const { registerSchema, loginSchema } = require("../../validators");

// Register
router.post("/register", validateRequest(registerSchema), registerUser);


// Login
router.post("/login", validateRequest(loginSchema), loginUser);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.put("/reset-password/:token", resetPassword);


module.exports = router;
