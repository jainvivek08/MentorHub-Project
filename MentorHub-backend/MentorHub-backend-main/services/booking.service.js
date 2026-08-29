const BookingModel = require("../models/booking.model");

const createBooking = async (bookingData) => {
  return await BookingModel.create(bookingData);
};

const getBookingById = async (bookingId) => {
  return await BookingModel.findById(bookingId)
    .populate("service")
    .populate("user");
};

const updateBookingById = async (bookingId, bookingData) => {
  return await BookingModel.findByIdAndUpdate(bookingId, bookingData, {
    new: true,
  });
};

const getUsersBooking = async (userId) => {
  return await BookingModel.find({ user: userId })
    .populate("service", "name duration")
    .populate("mentor", "name username")
    .sort({ dateAndTime: -1 });
};

const getMentorBookings = async (mentorId) => {
  return await BookingModel.find({ mentor: mentorId })
    .populate("user", "name email")
    .populate("service", "name duration")
    .sort({ dateAndTime: -1 });
};

module.exports = {
  createBooking,
  getBookingById,
  updateBookingById,
  getUsersBooking,
  getMentorBookings,
};
