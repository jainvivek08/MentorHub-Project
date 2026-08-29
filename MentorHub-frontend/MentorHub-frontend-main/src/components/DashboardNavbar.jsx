import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { removeToken } from "../helper";
import useUserStore from "../store/user";
import { FiLogOut } from "react-icons/fi";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  const onButtonClick = () => {
    removeToken();
    setUser(null);
    navigate("/");
  };

  const onAvatarClick = () => {
    navigate("/dashboard/profile");
  };

  return (
    <div>
      <div className="border-b bg-gray-50">
        <div className="container py-2 mx-auto">
          <div className="flex items-center justify-between ">
            <div>
              <div className="p-2">
                <NavLink to="/">
                  <p className="px-4 py-1 text-3xl font-bold tracking-wider text-gray-800 cursor-pointer">
                    MentorHub
                  </p>
                </NavLink>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onButtonClick}
                className="flex items-center w-full px-4 py-2 text-gray-600 transition-colors duration-300 transform border border-red-200 rounded-lg hover:bg-red-200 hover:text-gray-700 "
              >
                <span className="mx-4 font-medium">Log Out</span>
                <FiLogOut className="text-xl text-red-500" />
              </button>

              {/* Clickable avatar - opens the profile page */}
              <button
                onClick={onAvatarClick}
                title="My Profile"
                className="flex items-center justify-center w-10 h-10 overflow-hidden font-semibold text-purple-700 transition-transform bg-purple-100 border-2 border-purple-200 rounded-full hover:scale-105"
              >
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={`${user?.name}'s avatar`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span>
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "U"}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
