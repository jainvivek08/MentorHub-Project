const express = require("express");
const authController = require("../../controllers/auth.controller");
const asyncHandler = require("../../helper/asyncHandler");
const validate = require("../../middleware/validate");
const {
  signUpValidation,
  signInValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../../validations/auth.validation");

const router = express.Router();

router.post(
  "/signup",
  validate(signUpValidation),
  asyncHandler(authController.signUp)
);

router.post(
  "/signin",
  validate(signInValidation),
  asyncHandler(authController.signIn)
);

router.post(
  "/forgot-password",
  validate(forgotPasswordValidation),
  asyncHandler(authController.forgotPassword)
);

router.post(
  "/reset-password",
  validate(resetPasswordValidation),
  asyncHandler(authController.resetPassword)
);

module.exports = router;
