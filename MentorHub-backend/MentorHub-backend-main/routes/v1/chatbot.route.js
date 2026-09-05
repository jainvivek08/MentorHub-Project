const express = require("express");
const chatbotController = require("../../controllers/chatbot.controller");
const asyncHandler = require("../../helper/asyncHandler");
const validate = require("../../middleware/validate");
const { sendMessageSchema } = require("../../validations/chatbot.validation");
const { chatbotLimiter } = require("../../middleware/rateLimiter");

const router = express.Router();

// Left open (no authMiddleware.protect) so logged-out visitors can also ask
// "how does MentorHub work" style questions. If you'd rather only let
// logged-in users use it, add authMiddleware.protect before chatbotLimiter.
router.post(
  "/message",
  chatbotLimiter,
  validate(sendMessageSchema),
  asyncHandler(chatbotController.sendMessage)
);

module.exports = router;