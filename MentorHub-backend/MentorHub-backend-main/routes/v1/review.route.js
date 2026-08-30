const express = require("express");
const reviewController = require("../controllers/review.controller");
const asyncHandler = require("../helper/asyncHandler");
const validate = require("../middleware/validate");
const { protect, restrictTo } = require("../middleware/auth");
const { createReviewValidation } = require("../validations/review.validation");

const router = express.Router();

router.post(
  "/",
  protect,
  restrictTo("student"),
  validate(createReviewValidation),
  asyncHandler(reviewController.createReview)
);

router.get("/:mentorId", asyncHandler(reviewController.getMentorReviews));

module.exports = router;
