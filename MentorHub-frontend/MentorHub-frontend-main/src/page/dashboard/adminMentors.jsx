import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle, FaUserClock } from "react-icons/fa";
import Dashboard from "./dashboard";
import adminAPI from "../../apiManger/admin";

const AdminMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  // Track which specific mentor row has a button action in flight,
  // so we only disable/spin that row and not the whole list.
  const [actioningId, setActioningId] = useState(null);

  const fetchPendingMentors = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getPendingMentors();
      setMentors(res?.data?.mentors || []);
    } catch (error) {
      console.error("Error fetching pending mentors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingMentors();
  }, []);

  const handleDecision = async (mentorId, decision) => {
    setActioningId(mentorId);
    try {
      if (decision === "approve") {
        await adminAPI.approveMentor(mentorId);
        toast.success("Mentor approved");
      } else {
        await adminAPI.rejectMentor(mentorId);
        toast.success("Mentor rejected");
      }
      // Remove the mentor from the pending list once actioned
      setMentors((prev) => prev.filter((m) => m._id !== mentorId));
    } catch (error) {
      console.error("Error updating mentor status:", error);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <Dashboard>
      <div className="container p-6 mx-auto">
        <h2 className="mb-1 text-2xl font-bold text-gray-800 dark:text-white">
          Mentor Approvals
        </h2>
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          Review new mentor sign-ups before they go live on the platform.
        </p>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : mentors.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700">
            <FaUserClock className="mb-3 text-4xl text-gray-300 dark:text-gray-600" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              No pending mentors
            </p>
            <p className="max-w-sm mt-1 text-sm text-gray-500 dark:text-gray-400">
              New mentor sign-ups will show up here for review.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mentors.map((mentor) => (
              <div
                key={mentor._id}
                className="flex flex-col items-start justify-between gap-4 p-6 bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 md:flex-row md:items-center"
              >
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {mentor.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {mentor.email} · @{mentor.username}
                  </p>
                  {mentor.profile?.title && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {mentor.profile.title}
                      {mentor.profile?.college
                        ? ` · ${mentor.profile.college}`
                        : ""}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 whitespace-nowrap">
                  <button
                    onClick={() => handleDecision(mentor._id, "approve")}
                    disabled={actioningId === mentor._id}
                    className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <FaCheckCircle /> Approve
                  </button>
                  <button
                    onClick={() => handleDecision(mentor._id, "reject")}
                    disabled={actioningId === mentor._id}
                    className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    <FaTimesCircle /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default AdminMentors;
