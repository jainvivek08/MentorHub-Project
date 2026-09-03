const adminService = require("../services/admin.service");
const ApiError = require("../helper/apiError");
const httpStatus = require("../util/httpStatus");

const getPendingMentors = async (req, res) => {
  const mentors = await adminService.getPendingMentors();

  res.status(httpStatus.ok).json({
    success: true,
    mentors,
  });
};

const approveMentor = async (req, res, next) => {
  const mentor = await adminService.setMentorApprovalStatus(
    req.params.id,
    "approved"
  );

  if (!mentor) {
    return next(new ApiError(httpStatus.notFound, "Mentor not found"));
  }

  res.status(httpStatus.ok).json({
    success: true,
    message: "Mentor approved",
    mentor,
  });
};

const rejectMentor = async (req, res, next) => {
  const mentor = await adminService.setMentorApprovalStatus(
    req.params.id,
    "rejected"
  );

  if (!mentor) {
    return next(new ApiError(httpStatus.notFound, "Mentor not found"));
  }

  res.status(httpStatus.ok).json({
    success: true,
    message: "Mentor rejected",
    mentor,
  });
};

module.exports = {
  getPendingMentors,
  approveMentor,
  rejectMentor,
};
