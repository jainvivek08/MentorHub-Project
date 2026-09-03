const MessageModel = require("../models/message.model");
const BookingModel = require("../models/booking.model");
const ApiError = require("../helper/apiError");
const httpStatus = require("../util/httpStatus");

// A user may only chat on a booking they're part of - either as the
// student who booked it, or the mentor who owns the service.
const assertBookingAccess = async (bookingId, userId) => {
  const booking = await BookingModel.findById(bookingId);

  if (!booking) {
    throw new ApiError(httpStatus.notFound, "Booking not found");
  }

  const isParticipant =
    booking.user.toString() === userId.toString() ||
    booking.mentor.toString() === userId.toString();

  if (!isParticipant) {
    throw new ApiError(
      httpStatus.forbidden,
      "You do not have access to this conversation"
    );
  }

  return booking;
};

const getMessages = async (bookingId, userId) => {
  await assertBookingAccess(bookingId, userId);

  return await MessageModel.find({ booking: bookingId })
    .populate("sender", "name username role")
    .sort({ createdAt: 1 });
};

const sendMessage = async (bookingId, userId, text) => {
  await assertBookingAccess(bookingId, userId);

  const message = await MessageModel.create({
    booking: bookingId,
    sender: userId,
    text,
  });

  return await message.populate("sender", "name username role");
};

module.exports = {
  getMessages,
  sendMessage,
};
