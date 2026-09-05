const express = require("express");
const notificationController = require("../../controllers/notification.controller");
const asyncHandler = require("../../helper/asyncHandler");
const auth = require("../../middleware/auth");

const router = express.Router();

router.get(
  "/",
  auth.protect,
  asyncHandler(notificationController.getNotifications)
);

router.patch(
  "/:id/read",
  auth.protect,
  asyncHandler(notificationController.markAsRead)
);

router.patch(
  "/read-all",
  auth.protect,
  asyncHandler(notificationController.markAllAsRead)
);

module.exports = router;
