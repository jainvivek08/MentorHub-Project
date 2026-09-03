const UserModel = require("../models/user.model");

const getPendingMentors = async () => {
  return await UserModel.find({
    role: "mentor",
    approvalStatus: "pending",
  }).sort({ createdAt: 1 });
};

const setMentorApprovalStatus = async (mentorId, status) => {
  return await UserModel.findOneAndUpdate(
    { _id: mentorId, role: "mentor" },
    { approvalStatus: status },
    { new: true }
  );
};

module.exports = {
  getPendingMentors,
  setMentorApprovalStatus,
};
