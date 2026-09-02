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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce the search input so we don't hit the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1); // reset to first page whenever the search term changes
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch mentors from the server whenever the search term or page changes
  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      try {
        const response = await mentorAPI.getAllMentors({
          search: debouncedSearch || undefined,
          page,
          limit: 12,
        });
        setMentorsData(response?.data?.mentors || []);
        setTotalPages(response?.data?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [debouncedSearch, page, setMentorsData]);

  const filteredMentors = mentorsData;

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
                {debouncedSearch
                  ? `No mentors found matching "${searchTerm}".`
                  : "No mentors available."}
              </p>
            )}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              className="px-4 py-2 border rounded disabled:opacity-40 dark:text-white dark:border-gray-600"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="dark:text-white">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-4 py-2 border rounded disabled:opacity-40 dark:text-white dark:border-gray-600"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllMentors;
