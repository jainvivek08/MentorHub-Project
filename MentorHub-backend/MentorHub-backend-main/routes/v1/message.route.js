const express = require("express");
const messageController = require("../../controllers/message.controller");
const asyncHandler = require("../../helper/asyncHandler");
const validate = require("../../middleware/validate");
const auth = require("../../middleware/auth");
const {
  sendMessageValidation,
} = require("../../validations/message.validation");

const router = express.Router();

router.get(
  "/:bookingId",
  auth.protect,
  asyncHandler(messageController.getMessages)
);

router.post(
  "/:bookingId",
  auth.protect,
  validate(sendMessageValidation),
  asyncHandler(messageController.sendMessage)
);

module.exports = router;
