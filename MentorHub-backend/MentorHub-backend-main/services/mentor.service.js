const ServiceModel = require("../models/service.model");
const UserModel = require("../models/user.model");

const getAllMentors = async ({ search, tag, page = 1, limit = 12 } = {}) => {
  const query = { role: "mentor", approvalStatus: "approved" };

  if (search) {
    const regex = { $regex: search, $options: "i" };
    query.$or = [
      { name: regex },
      { username: regex },
      { "profile.title": regex },
      { "profile.college": regex },
      { "profile.tags": regex },
    ];
  }

  if (tag) {
    query["profile.tags"] = { $in: [tag] };
  }

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 12, 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const [mentors, total] = await Promise.all([
    UserModel.find(query).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
    UserModel.countDocuments(query),
  ]);

  return {
    mentors,
    total,
    page: pageNum,
    totalPages: Math.max(Math.ceil(total / limitNum), 1),
  };
};

const getMentorById = async (id) => {
  return await UserModel.findOne({ _id: id, role: "mentor", approvalStatus: "approved" });
};

const getMentorByUsername = async (username) => {
  return await UserModel.findOne({ username, role: "mentor", approvalStatus: "approved" });
};

const getMentorServices = async (id) => {
  return await ServiceModel.find({ mentor: id, active: true });
};

module.exports = {
  getAllMentors,
  getMentorById,
  getMentorByUsername,
  getMentorServices,
};
