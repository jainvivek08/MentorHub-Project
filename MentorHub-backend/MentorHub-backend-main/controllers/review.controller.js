const reviewService = require("../services/review.service");
const httpStatus = require("../util/httpStatus");

const createReview = async (req, res) => {
  const review = await reviewService.createReview(req.user._id, req.body);

  return res.status(httpStatus.created).json({
    message: "Review submitted successfully",
    review,
  });
};

const getMentorReviews = async (req, res) => {
  const { mentorId } = req.params;

  const data = await reviewService.getMentorReviews(mentorId);

  return res.status(httpStatus.ok).json({
    success: true,
    ...data,
  });
};

module.exports = {
  createReview,
  getMentorReviews,
};
