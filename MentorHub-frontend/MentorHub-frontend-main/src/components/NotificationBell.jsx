import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { FaBell } from "react-icons/fa";
import notificationAPI from "../apiManger/notification";

const POLL_INTERVAL_MS = 20000;

const NotificationBell = ({ dark = false }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.getNotifications();
      setNotifications(res?.data?.notifications || []);
      setUnreadCount(res?.data?.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Close the dropdown when clicking outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await notificationAPI.markAsRead(notification._id);
        setUnreadCount((prev) => Math.max(prev - 1, 0));
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, read: true } : n
          )
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
    setOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAllAsRead = async (e) => {
    e.stopPropagation();
    try {
      await notificationAPI.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        className={`relative flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
          dark
            ? "border border-white text-gray-200 hover:text-white"
            : "border border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
        }`}
      >
        <FaBell className="text-base" />
        {unreadCount > 0 && (
          <span className="absolute flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full -top-1 -right-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg w-80">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">
              Notifications
            </p>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-medium text-purple-600 hover:text-purple-800"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="overflow-y-auto max-h-96">
            {notifications.length === 0 ? (
              <p className="py-8 text-sm text-center text-gray-400">
                No notifications yet.
              </p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex flex-col w-full gap-1 px-4 py-3 text-left border-b border-gray-50 hover:bg-gray-50 ${
                    notification.read ? "" : "bg-purple-50"
                  }`}
                >
                  <p className="text-sm text-gray-800">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400">
                    {moment(notification.createdAt).fromNow()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
