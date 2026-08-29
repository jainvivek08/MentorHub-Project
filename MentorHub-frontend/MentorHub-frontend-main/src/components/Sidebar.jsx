import React from "react";
import { NavLink } from "react-router-dom";

const navItemClass = ({ isActive }) =>
  `flex items-center px-4 py-2 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700 ${
    isActive ? "bg-gray-100 text-gray-700" : "text-gray-600"
  }`;

const Sidebar = () => {
  return (
    <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r">
      <div className="px-2 mb-4">
        <h1 className="text-2xl font-bold tracking-wide text-gray-800">
          MentorHub
        </h1>
      </div>

      <div className="flex flex-col justify-between flex-1 mt-4">
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
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
