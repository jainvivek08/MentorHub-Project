const ReviewModel = require("../models/review.model");
const BookingModel = require("../models/booking.model");
const UserModel = require("../models/user.model");
const ApiError = require("../helper/apiError");
const httpStatus = require("../util/httpStatus");

// Recalculate and persist the mentor's average rating + review count
// so mentor listing / cards can show it without an extra query per mentor.
const recalculateMentorRating = async (mentorId) => {
  const stats = await ReviewModel.aggregate([
    { $match: { mentor: mentorId } },
    {
      $group: {
        _id: "$mentor",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const { averageRating = 0, reviewCount = 0 } = stats[0] || {};

  await UserModel.findByIdAndUpdate(mentorId, {
    "profile.averageRating": Math.round(averageRating * 10) / 10,
    "profile.reviewCount": reviewCount,
  });
};

const createReview = async (studentId, { bookingId, rating, comment }) => {
  const booking = await BookingModel.findById(bookingId);

  if (!booking) {
    throw new ApiError(httpStatus.notFound, "Booking not found");
  }

  if (String(booking.user) !== String(studentId)) {
    throw new ApiError(
      httpStatus.forbidden,
      "You can only review your own bookings"
    );
  }

  if (booking.status !== "confirmed") {
    throw new ApiError(
      httpStatus.badRequest,
      "Only confirmed sessions can be reviewed"
    );
  }

  const existingReview = await ReviewModel.findOne({ booking: bookingId });
  if (existingReview) {
    throw new ApiError(
      httpStatus.conflict,
      "You have already reviewed this session"
    );
  }

  const review = await ReviewModel.create({
    mentor: booking.mentor,
    student: studentId,
    booking: bookingId,
    rating,
    comment,
  });

  await recalculateMentorRating(booking.mentor);

  return review;
};

const getMentorReviews = async (mentorId) => {
  const reviews = await ReviewModel.find({ mentor: mentorId })
    .populate("student", "name photoUrl")
    .sort({ createdAt: -1 });

  const mentor = await UserModel.findById(mentorId).select(
    "profile.averageRating profile.reviewCount"
  );

  return {
    reviews,
    averageRating: mentor?.profile?.averageRating || 0,
    reviewCount: mentor?.profile?.reviewCount || 0,
  };
};

module.exports = {
  createReview,
  getMentorReviews,
};
