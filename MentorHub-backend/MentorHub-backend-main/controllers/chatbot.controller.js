const httpStatus = require("../util/httpStatus");
const chatbotService = require("../services/chatbot.service");

const sendMessage = async (req, res, next) => {
  const { message, history } = req.body;

  const reply = await chatbotService.sendMessage(message, history);

  res.status(httpStatus.ok).json({
    success: true,
    reply,
  });
};

module.exports = {
  sendMessage,
};