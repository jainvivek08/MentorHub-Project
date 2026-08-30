import React from "react";
import { FaUniversity } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import StarRating from "./StarRating";

const MentorCard = ({ mentor }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle card click
  const onCardClick = () => {
    // Navigate to MentorDetails page, passing the username
    navigate(`/mentor/${mentor?.username}`);
  };

  return (
    <div
      onClick={onCardClick} // Trigger navigation on click
      className="w-full overflow-hidden transition-all duration-300 bg-white border rounded-lg shadow-md cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative group">
        <img
          src={
            mentor?.photoUrl ||
            `https://ui-avatars.com/api?name=${mentor?.name}`
          }
          alt={`${mentor?.name}'s avatar`}
          className="object-cover w-full h-64 rounded-t-lg "
        />
        <div className="absolute inset-0 transition-opacity bg-gradient-to-t from-black via-transparent to-transparent opacity-90 group-hover:opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-full p-2 text-center text-white">
          <h4 className="text-lg font-bold">
            {mentor?.profile?.title || "Title"}
          </h4>
        </div>
      </div>
      <div className="p-4 ">
        <div className="m4 ">
          <h3 className="py-2 text-xl font-bold dark:text-white">
            {mentor?.name || "Name"}
          </h3>
          <div className="flex gap-x-2">
            <FaUniversity className="dark:text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {mentor?.profile?.college || "College"}
            </p>
          </div>
          {mentor?.profile?.reviewCount > 0 ? (
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={mentor?.profile?.averageRating || 0} size="text-sm" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {mentor.profile.averageRating.toFixed(1)} ({mentor.profile.reviewCount})
              </span>
            </div>
          ) : (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              No reviews yet
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {mentor?.profile?.tags.map((tag, index) => {
            return (
              <span
                key={index}
                className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-200"
              >
                {tag || "Tag"}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
