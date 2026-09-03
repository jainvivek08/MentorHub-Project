const messageService = require("../services/message.service");
const httpStatus = require("../util/httpStatus");

const getMessages = async (req, res) => {
  const { bookingId } = req.params;

  const messages = await messageService.getMessages(bookingId, req.user._id);

  res.status(httpStatus.ok).json({
    success: true,
    messages,
  });
};

const sendMessage = async (req, res) => {
  const { bookingId } = req.params;
  const { text } = req.body;

  const message = await messageService.sendMessage(
    bookingId,
    req.user._id,
    text
  );

  res.status(httpStatus.created).json({
    success: true,
    message,
  });
};

module.exports = {
  getMessages,
  sendMessage,
};
