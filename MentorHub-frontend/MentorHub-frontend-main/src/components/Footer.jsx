import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div>
      <footer className="px-8 py-10 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p>Follow us on social media for updates and mentorship tips!</p>
          <p className="mt-4">
            <a href="#" className="hover:text-[#00b89a] dark:hover:text-[#00DFBD]">
              Facebook
            </a>{" "}
            |{" "}
            <a href="#" className="hover:text-[#00b89a] dark:hover:text-[#00DFBD]">
              Twitter
            </a>{" "}
            |{" "}
            <a href="#" className="hover:text-[#00b89a] dark:hover:text-[#00DFBD]">
              LinkedIn
            </a>
          </p>
          <p className="mt-4 text-gray-500 dark:text-gray-400">© {currentYear} MentorHub. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
