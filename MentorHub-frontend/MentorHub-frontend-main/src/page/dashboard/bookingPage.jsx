import React, { useEffect, useState } from "react";
import { Spin, Empty } from "antd";
import { FaClock, FaVideo, FaCalendarAlt, FaUserCircle, FaStar, FaComments } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import moment from "moment";
import Layout from "../../components/Layout";
import booking from "../../apiManger/booking";

const SessionCard = ({ record }) => {
  const isUpcoming = moment(record.dateAndTime).isAfter(moment());
  const canJoin = record.status === "confirmed" && record.meetingLink;

  const badge = () => {
    if (canJoin) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-purple-600 rounded-full">
          <FaVideo className="text-[10px]" /> LIVE SESSION
        </span>
      );
    }
    if (record.status === "pending") {
      return (
        <span className="px-3 py-1 text-xs font-semibold text-white bg-orange-500 rounded-full">
          PAYMENT PENDING
        </span>
      );
    }
    if (isUpcoming) {
      return (
        <span className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
          UPCOMING SESSION
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-semibold text-white bg-gray-500 rounded-full">
        COMPLETED
      </span>
    );
  };

  return (
    <div className="flex flex-col overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 px-5 pt-5">
        {badge()}
        <span className="ml-auto px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
          {moment(record.dateAndTime).format("DD MMM, YYYY")}
        </span>
      </div>

      <div className="px-5 pt-3">
        <h3 className="text-lg font-bold text-gray-900">
          {record.service?.name || "Mentorship Session"}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-y-3 px-5 pt-4 pb-5 mt-2 bg-gray-50">
        <div>
          <p className="text-xs text-gray-400">Time</p>
          <p className="flex items-center gap-1 text-sm font-medium text-gray-800">
            <FaClock className="text-gray-400" />
            {moment(record.dateAndTime).format("hh:mm A")}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Duration</p>
          <p className="text-sm font-medium text-gray-800">
            {record.service?.duration
              ? record.service.duration + " mins"
              : "-"}
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-gray-400">Amount Paid</p>
          <p className="text-sm font-medium text-gray-800">
            ₹{record.price}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5">
        {canJoin ? (
          <button
            onClick={() => window.open(record.meetingLink, "_blank")}
            className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Join Session
          </button>
        ) : record.status === "pending" ? (
          <div className="w-full py-3 font-semibold text-center text-orange-600 bg-orange-50 rounded-lg">
            Awaiting Payment Confirmation
          </div>
        ) : isUpcoming ? (
          <div className="w-full py-3 font-semibold text-center text-gray-400 bg-gray-100 rounded-lg">
            Link will appear here shortly
          </div>
        ) : (
          <div className="w-full py-3 font-semibold text-center text-gray-400 bg-gray-100 rounded-lg">
            Session Ended
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-100">
        <FaUserCircle className="text-3xl text-gray-300" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">
            {record.mentor?.name || "Mentor"}
          </p>
          <p className="text-xs text-gray-400">Your session mentor</p>
        </div>
        {record.status === "confirmed" && (
          <NavLink
            to={`/booking/${record._id}/chat`}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-full hover:bg-purple-100"
          >
            <FaComments /> Chat
          </NavLink>
        )}
        {!isUpcoming && record.status === "confirmed" && record.mentor?.username && (
          <NavLink
            to={`/mentor/${record.mentor.username}?bookingId=${record._id}`}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-full hover:bg-yellow-100"
          >
            <FaStar className="text-yellow-500" /> Leave a review
          </NavLink>
        )}
      </div>
    </div>
  );
};

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await booking.getStudentBookigs();
      setBookings(res?.data?.bookings || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "upcoming") {
      return moment(b.dateAndTime).isAfter(moment());
    }
    return moment(b.dateAndTime).isBefore(moment());
  });

  return (
    <Layout>
      <div className="container p-4 mx-auto max-w-6xl">
        <h2 className="mb-1 text-2xl font-bold text-gray-800">My Sessions</h2>
        <p className="mb-6 text-gray-500">
          All your booked mentorship sessions in one place.
        </p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={
              "px-4 py-2 rounded-md text-sm font-medium transition-colors " +
              (activeTab === "upcoming"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200")
            }
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={
              "px-4 py-2 rounded-md text-sm font-medium transition-colors " +
              (activeTab === "past"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200")
            }
          >
            Past
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-16">
            <Empty
              description={
                activeTab === "upcoming"
                  ? "No upcoming sessions"
                  : "No past sessions"
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredBookings.map((record) => (
              <SessionCard key={record._id} record={record} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
