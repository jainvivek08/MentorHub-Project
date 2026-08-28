import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import booking from "../apiManger/booking";

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = location.state?.bookingId;

  const [meetingLink, setMeetingLink] = useState(null);
  const [checking, setChecking] = useState(true);
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!bookingId) {
      setChecking(false);
      return;
    }

    const pollForMeetingLink = async () => {
      try {
        const res = await booking.getStudentBookigs();
        const bookings = res?.data?.bookings || [];
        const currentBooking = bookings.find((b) => b._id === bookingId);

        if (currentBooking?.meetingLink) {
          setMeetingLink(currentBooking.meetingLink);
          setChecking(false);
          return;
        }
      } catch (err) {
        console.error("Error checking booking status:", err);
      }

      attemptsRef.current += 1;
      // Stop polling after ~30 seconds (15 attempts * 2s)
      if (attemptsRef.current < 15) {
        setTimeout(pollForMeetingLink, 2000);
      } else {
        setChecking(false);
      }
    };

    pollForMeetingLink();
  }, [bookingId]);

  return (
    <Layout>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="p-10 text-center bg-white rounded shadow-lg">
          <h1 className="text-3xl font-bold text-green-500">Thank You!</h1>
          <p className="mt-4 text-lg">Your booking has been confirmed.</p>

          {meetingLink ? (
            <div className="p-4 mt-6 bg-green-50 border border-green-200 rounded">
              <p className="mb-3 text-gray-700">Your meeting is ready:</p>
              
                href={meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 text-white bg-green-500 rounded hover:bg-green-400"
              >
                Join Meeting
              </a>
            </div>
          ) : checking ? (
            <div className="mt-6">
              <p className="text-gray-600">
                Setting up your meeting link, please wait...
              </p>
              <div className="relative w-12 h-12 mx-auto mt-4 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <p className="mt-2 text-gray-600">
              The meeting link will be shared over your registered email
              shortly.
            </p>
          )}

          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 mt-8 text-white bg-blue-500 rounded hover:bg-blue-400"
          >
            Back to Home
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SuccessPage;
