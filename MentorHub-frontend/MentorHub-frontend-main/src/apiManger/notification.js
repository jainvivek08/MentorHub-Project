import AxiosInstances from ".";

const getNotifications = () => {
  return AxiosInstances.get("/notification", { skipErrorToast: true });
};

const markAsRead = (notificationId) => {
  return AxiosInstances.patch(`/notification/${notificationId}/read`);
};

const markAllAsRead = () => {
  return AxiosInstances.patch("/notification/read-all");
};

const notificationAPI = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};

export default notificationAPI;
