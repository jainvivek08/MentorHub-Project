const UserModel = require("../models/user.model");
const notificationService = require("./notification.service");

const getPendingMentors = async () => {
  return await UserModel.find({
    role: "mentor",
    approvalStatus: "pending",
  }).sort({ createdAt: 1 });
};

const setMentorApprovalStatus = async (mentorId, status) => {
  const mentor = await UserModel.findOneAndUpdate(
    { _id: mentorId, role: "mentor" },
    { approvalStatus: status },
    { new: true }
  );

  if (mentor) {
    await notificationService.createNotification({
      userId: mentor._id,
      type: status === "approved" ? "mentor_approved" : "mentor_rejected",
      message:
        status === "approved"
          ? "Your mentor profile has been approved and is now live"
          : "Your mentor application was not approved",
      link: "/dashboard/overview",
    });
  }

  return mentor;
};

module.exports = {
  getPendingMentors,
  setMentorApprovalStatus,
};
