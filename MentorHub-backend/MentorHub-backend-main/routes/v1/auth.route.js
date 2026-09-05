const express = require("express");
const authController = require("../../controllers/auth.controller");
const asyncHandler = require("../../helper/asyncHandler");
const validate = require("../../middleware/validate");
const { authLimiter } = require("../../middleware/rateLimiter");
const {
  signUpValidation,
  signInValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../../validations/auth.validation");

const router = express.Router();

router.post(
  "/signup",
  authLimiter,
  validate(signUpValidation),
  asyncHandler(authController.signUp)
);

router.post(
  "/signin",
  authLimiter,
  validate(signInValidation),
  asyncHandler(authController.signIn)
);

router.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordValidation),
  asyncHandler(authController.forgotPassword)
);

router.post(
  "/reset-password",
  authLimiter,
  validate(resetPasswordValidation),
  asyncHandler(authController.resetPassword)
);

module.exports = router;
