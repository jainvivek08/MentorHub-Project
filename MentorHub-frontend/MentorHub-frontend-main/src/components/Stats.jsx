import React from "react";

const stats = [
  { value: "50+", label: "Total Mentors" },
  { value: "1,200+", label: "Sessions Booked" },
  { value: "3,500+", label: "Total Students" },
  { value: "95%", label: "Success Rate" },
];

const Stats = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800">
      <div className="grid grid-cols-2 max-w-screen-xl px-4 py-10 mx-auto text-center sm:grid-cols-4 md:px-24 lg:px-8">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`px-2 py-4 sm:py-0 ${
              index !== 0 ? "sm:border-l border-gray-200 dark:border-gray-700" : ""
            }`}
          >
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
