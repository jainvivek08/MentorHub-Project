import React from "react";
import { NavLink } from "react-router-dom";
import useUserStore from "../store/user";

const navItemClass = ({ isActive }) =>
  `flex items-center px-4 py-2 transition-colors duration-300 transform rounded-lg hover:bg-gray-800 hover:text-white ${
    isActive
      ? "bg-gray-800 text-white"
      : "text-gray-300"
  }`;

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const { user } = useUserStore();
  const isMentor = user?.role === "mentor";
  const isAdmin = user?.role === "admin";

  return (
    <>
      {/* Overlay - mobile only, shown when sidebar is open */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-black border-r border-gray-800 transform transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      <div className="px-2 pb-4 mb-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold tracking-wide text-white">
          MentorHub
        </h1>
      </div>

      <div className="flex flex-col justify-between flex-1 mt-4" onClick={onClose}>
        <nav className="space-y-2">
          <NavLink to="/dashboard/overview" className={navItemClass}>
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 13H10V3H3V13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 21H21V11H14V21Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 3V7H21V3H14Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 21H10V17H3V21Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="mx-4 font-medium">Overview</span>
          </NavLink>

          <NavLink to="/mentors" className={navItemClass}>
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 21L16.65 16.65"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="mx-4 font-medium">Explore Mentors</span>
          </NavLink>

          {isMentor ? (
            <>
              <NavLink to="/dashboard/services" className={navItemClass}>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 12H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8V16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 21C17.523 21 22 16.523 22 11C22 5.477 17.523 1 12 1C6.477 1 2 5.477 2 11C2 16.523 6.477 21 12 21Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="mx-4 font-medium">Services</span>
              </NavLink>

              <NavLink to="/dashboard/schedule" className={navItemClass}>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8H21M16 2V5M8 2V5M3 9V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V9M3 9H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="mx-4 font-medium">Schedule</span>
              </NavLink>

              <NavLink to="/dashboard/payment" className={navItemClass}>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 6H21C22.1046 6 23 6.89543 23 8V16C23 17.1046 22.1046 18 21 18H3C1.89543 18 1 17.1046 1 16V8C1 6.89543 1.89543 6 3 6Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1 10H23"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="mx-4 font-medium">Payment</span>
              </NavLink>

              <NavLink to="/dashboard/bookings" className={navItemClass}>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 6H21C22.1046 6 23 6.89543 23 8V16C23 17.1046 22.1046 18 21 18H3C1.89543 18 1 17.1046 1 16V8C1 6.89543 1.89543 6 3 6Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1 10H23"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="mx-4 font-medium">Bookings</span>
              </NavLink>
            </>
          ) : !isAdmin ? (
            <>
              <NavLink to="/user-bookings" className={navItemClass}>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23 7L16 12L23 17V7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1 5H15C16.1046 5 17 5.89543 17 7V17C17 18.1046 16.1046 19 15 19H1C-0.104569 19 -1 18.1046 -1 17V7C-1 5.89543 -0.104569 5 1 5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="mx-4 font-medium">My Sessions</span>
              </NavLink>
            </>
          ) : null}

          {isAdmin && (
            <NavLink to="/dashboard/admin/mentors" className={navItemClass}>
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12L11 14L15 10M20.618 5.984C17.4571 6.13673 14.4165 4.75355 12.4649 2.28479C12.2426 2.00473 11.7574 2.00473 11.5351 2.28479C9.58354 4.75355 6.54293 6.13673 3.38197 5.984C3.02976 6.86217 3 7.77987 3 8.7C3 15.4 7.5 20.4 12 22C16.5 20.4 21 15.4 21 8.7C21 7.77987 20.9702 6.86217 20.618 5.984Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mx-4 font-medium">Mentor Approvals</span>
            </NavLink>
          )}

        </nav>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
