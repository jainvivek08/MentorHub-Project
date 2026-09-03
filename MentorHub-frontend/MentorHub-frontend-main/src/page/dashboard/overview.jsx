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
  const isMentor = user?.role === "mentor";

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = isMentor
        ? await booking.getMentorBookings()
        : await booking.getStudentBookigs();
      setBookings(res?.data?.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMentor]);

  const upcomingSessions = bookings
    .filter((b) => moment(b.dateAndTime).isAfter(moment()))
    .sort((a, b) => moment(a.dateAndTime) - moment(b.dateAndTime));

  const nextSession = upcomingSessions[0];

  // For a mentor, the "other person" on the card is the student.
  // For a student, the "other person" on the card is the mentor.
  const otherPersonName = isMentor
    ? nextSession?.user?.name
    : nextSession?.mentor?.name;

  const meetingUrl = isMentor
    ? nextSession?.startUrl || nextSession?.meetingLink
    : nextSession?.meetingLink;

  return (
    <Dashboard>
      <div className="container p-6 mx-auto">
        <h2 className="mb-1 text-2xl font-bold text-gray-800 dark:text-white">
          Welcome back, {user?.name?.split(" ")[0] || "there"}!
        </h2>
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          {isMentor
            ? "Here's what's happening with your mentoring sessions."
            : "Here's what's happening with your mentorship sessions."}
        </p>

        {isMentor && user?.approvalStatus === "pending" && (
          <div className="p-4 mb-6 text-sm font-medium text-orange-700 border border-orange-200 rounded-lg bg-orange-50 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-900">
            Your mentor profile is awaiting admin approval. You won't appear
            in mentor search results until it's approved.
          </div>
        )}

        {isMentor && user?.approvalStatus === "rejected" && (
          <div className="p-4 mb-6 text-sm font-medium text-red-700 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950 dark:text-red-300 dark:border-red-900">
            Your mentor application was not approved. Please contact support
            for more details.
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Next Session / No booked session card */}
            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white">
              Your Next Session
            </h3>

            {nextSession ? (
              <div className="flex flex-col items-start justify-between gap-4 p-6 mb-8 bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-purple-600 bg-purple-100 rounded-full dark:bg-purple-950 dark:text-purple-300">
                    <FaUserCircle />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {nextSession.service?.name || "Mentorship Session"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isMentor ? "with " : "with "}
                      {otherPersonName || (isMentor ? "your student" : "your mentor")}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
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

                {nextSession.status === "confirmed" && meetingUrl ? (
                  <button
                    onClick={() => window.open(meetingUrl, "_blank")}
                    className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 whitespace-nowrap"
                  >
                    <FaVideo />
                    {isMentor ? "Start Meeting" : "Join Session"}
                  </button>
                ) : nextSession.status === "pending" ? (
                  <span className="px-4 py-2 text-sm font-semibold text-orange-600 rounded-lg bg-orange-50 dark:bg-orange-950 dark:text-orange-300 whitespace-nowrap">
                    Awaiting Payment
                  </span>
                ) : (
                  <span className="px-4 py-2 text-sm font-semibold text-gray-500 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-300 whitespace-nowrap">
                    Link will appear shortly
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 mb-8 text-center bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700">
                <FaCalendarAlt className="mb-3 text-4xl text-gray-300 dark:text-gray-600" />
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  No booked session
                </p>
                <p className="max-w-sm mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {isMentor
                    ? "You don't have any upcoming sessions yet. Once a student books your service, it'll show up here."
                    : "You haven't booked any mentorship sessions yet. Browse our mentors and book your first session to get started."}
                </p>
                {!isMentor && (
                  <NavLink to="/mentors">
                    <button className="px-6 py-2 mt-4 font-semibold text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700">
                      Find a Mentor
                    </button>
                  </NavLink>
                )}
                {isMentor && (
                  <NavLink to="/dashboard/services">
                    <button className="px-6 py-2 mt-4 font-semibold text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700">
                      Manage Your Services
                    </button>
                  </NavLink>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Dashboard>
  );
};

export default Overview;
