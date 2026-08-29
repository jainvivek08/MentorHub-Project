import React, { useEffect, useState } from "react";
import moment from "moment";
import { NavLink } from "react-router-dom";
import { Spin } from "antd";
import { FaClock, FaVideo, FaUserCircle, FaCalendarAlt } from "react-icons/fa";
import Dashboard from "./dashboard";
import booking from "../../apiManger/booking";
import useUserStore from "../../store/user";

const Overview = () => {
  const { user } = useUserStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await booking.getStudentBookigs();
      setBookings(res?.data?.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const upcomingSessions = bookings
    .filter((b) => moment(b.dateAndTime).isAfter(moment()))
    .sort((a, b) => moment(a.dateAndTime) - moment(b.dateAndTime));

  const nextSession = upcomingSessions[0];

  return (
    <Dashboard>
      <div className="container p-6 mx-auto">
        <h2 className="mb-1 text-2xl font-bold text-gray-800">
          Welcome back, {user?.name?.split(" ")[0] || "there"}!
        </h2>
        <p className="mb-6 text-gray-500">
          Here's what's happening with your mentorship sessions.
        </p>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Next Session / No booked session card */}
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Your Next Session
            </h3>

            {nextSession ? (
              <div className="flex flex-col items-start justify-between gap-4 p-6 mb-8 bg-white border shadow-sm rounded-xl md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-purple-600 bg-purple-100 rounded-full">
                    <FaUserCircle />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {nextSession.service?.name || "Mentorship Session"}
                    </p>
                    <p className="text-sm text-gray-500">
                      with {nextSession.mentor?.name || "your mentor"}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-400" />
                        {moment(nextSession.dateAndTime).format(
                          "DD MMM YYYY"
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock className="text-gray-400" />
                        {moment(nextSession.dateAndTime).format("hh:mm A")}
                      </span>
                    </div>
                  </div>
                </div>

                {nextSession.status === "confirmed" &&
                (nextSession.startUrl || nextSession.meetingLink) ? (
                  <button
                    onClick={() =>
                      window.open(
                        nextSession.startUrl || nextSession.meetingLink,
                        "_blank"
                      )
                    }
                    className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 whitespace-nowrap"
                  >
                    <FaVideo />
                    Join Session
                  </button>
                ) : nextSession.status === "pending" ? (
                  <span className="px-4 py-2 text-sm font-semibold text-orange-600 rounded-lg bg-orange-50 whitespace-nowrap">
                    Awaiting Payment
                  </span>
                ) : (
                  <span className="px-4 py-2 text-sm font-semibold text-gray-500 rounded-lg bg-gray-100 whitespace-nowrap">
                    Link will appear shortly
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 mb-8 text-center bg-white border shadow-sm rounded-xl">
                <FaCalendarAlt className="mb-3 text-4xl text-gray-300" />
                <p className="text-lg font-semibold text-gray-700">
                  No booked session
                </p>
                <p className="max-w-sm mt-1 text-sm text-gray-500">
                  You haven't booked any mentorship sessions yet. Browse our
                  mentors and book your first session to get started.
                </p>
                <NavLink to="/mentors">
                  <button className="px-6 py-2 mt-4 font-semibold text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700">
                    Find a Mentor
                  </button>
                </NavLink>
              </div>
            )}
          </>
        )}
      </div>
    </Dashboard>
  );
};

export default Overview;
