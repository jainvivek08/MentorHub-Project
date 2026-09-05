const NotificationModel = require("../models/notification.model");

// Used internally by other services (booking, message, admin) to fire a
// notification - never exposed directly via a public "create" endpoint.
const createNotification = async ({ userId, type, message, link }) => {
  return await NotificationModel.create({ user: userId, type, message, link });
};

const getNotifications = async (userId, { limit = 20 } = {}) => {
  return await NotificationModel.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

const getUnreadCount = async (userId) => {
  return await NotificationModel.countDocuments({ user: userId, read: false });
};

const markAsRead = async (notificationId, userId) => {
  return await NotificationModel.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  );
};

const markAllAsRead = async (userId) => {
  await NotificationModel.updateMany(
    { user: userId, read: false },
    { read: true }
  );
};

module.exports = {
  createNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
