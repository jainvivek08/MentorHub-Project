const express = require("express");
const adminController = require("../../controllers/admin.controller");
const asyncHandler = require("../../helper/asyncHandler");
const { protect, restrictTo } = require("../../middleware/auth");

const router = express.Router();

// Every route below requires a logged-in admin
router.use(protect, restrictTo("admin"));

router.get("/mentors/pending", asyncHandler(adminController.getPendingMentors));
router.patch("/mentors/:id/approve", asyncHandler(adminController.approveMentor));
router.patch("/mentors/:id/reject", asyncHandler(adminController.rejectMentor));

module.exports = router;
