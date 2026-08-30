import React, { useEffect, useState } from "react";
import { Spin } from "antd"; // Import the Spin component from antd
import useMentorStore from "../store/mentors";
import MentorCard from "../components/MentorCard";
import mentorAPI from "../apiManger/mentor";
import DashboardNavbar from "../components/DashboardNavbar";
import Layout from "../components/Layout";

const AllMentors = () => {
  const { mentorsData, setMentorsData } = useMentorStore();
  const [loading, setLoading] = useState(false); // State for tracking loading status
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch mentors when the component mounts if mentorsData is empty
  useEffect(() => {
    const fetchAllMentors = async () => {
      setLoading(true); // Start loading
      try {
        const response = await mentorAPI.getAllMentors();
        const allMentors = response?.data?.mentors || [];
        setMentorsData(allMentors); // Store all mentors in the Zustand store
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setLoading(false); // Stop loading once the request completes
      }
    };

    if (mentorsData.length === 0) {
      fetchAllMentors();
    }
  }, [mentorsData, setMentorsData]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredMentors = mentorsData.filter((mentor) => {
    if (!normalizedSearch) return true;

    const haystacks = [
      mentor?.name,
      mentor?.profile?.title,
      mentor?.profile?.college,
      ...(mentor?.profile?.tags || []),
    ];

    return haystacks.some((value) =>
      value?.toLowerCase().includes(normalizedSearch)
    );
  });

  return (
    <Layout>
      <div className="container mx-auto my-10">
        <h2 className="mb-8 text-3xl font-bold text-center dark:text-white">
          Book Your Session Now
        </h2>

        <div className="flex justify-center mb-20">
          <input
            className="w-1/2 p-2 border border-gray-400 rounded outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            type="text"
            placeholder="Search by name, skill, or college..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex justify-center my-10">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {filteredMentors.length > 0 ? (
              filteredMentors.map((mentor) => (
                <MentorCard key={mentor?._id} mentor={mentor} />
              ))
            ) : (
              <p className="col-span-4 text-center dark:text-gray-300">
                {normalizedSearch
                  ? `No mentors found matching "${searchTerm}".`
                  : "No mentors available."}
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllMentors;
