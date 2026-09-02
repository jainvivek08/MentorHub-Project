const mentorService = require("../services/mentor.service");
const ApiError = require("../helper/apiError");
const httpStatus = require("../util/httpStatus");

const getMentorInfoByUsername = async (req, res, next) => {
  const { username } = req.params;

  const mentor = await mentorService.getMentorByUsername(username);

  if (!mentor) {
    return next(new ApiError(httpStatus.notFound, "Mentor not found"));
  }

  const services = await mentorService.getMentorServices(mentor._id);

  res.status(httpStatus.ok).json({
    success: true,
    mentor,
    services,
  });
};

const getAllMentors = async (req, res, next) => {
  const { search, tag, page, limit } = req.query;

  const result = await mentorService.getAllMentors({ search, tag, page, limit });

  res.status(httpStatus.ok).json({
    success: true,
    ...result,
  });
};

module.exports = {
  getMentorInfoByUsername,
  getAllMentors,
};
