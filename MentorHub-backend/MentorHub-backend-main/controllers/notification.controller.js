const notificationService = require("../services/notification.service");
const httpStatus = require("../util/httpStatus");

const getNotifications = async (req, res) => {
  const notifications = await notificationService.getNotifications(
    req.user._id
  );
  const unreadCount = await notificationService.getUnreadCount(req.user._id);

  res.status(httpStatus.ok).json({
    success: true,
    notifications,
    unreadCount,
  });
};

const markAsRead = async (req, res) => {
  const notification = await notificationService.markAsRead(
    req.params.id,
    req.user._id
  );

  res.status(httpStatus.ok).json({
    success: true,
    notification,
  });
};

const markAllAsRead = async (req, res) => {
  await notificationService.markAllAsRead(req.user._id);

  res.status(httpStatus.ok).json({
    success: true,
  });
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
