import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { Dropdown, Menu } from "antd";
import { AiOutlineDashboard } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { FaVideo } from "react-icons/fa";
import logo from "../assets/logo-no-background.png";
import useUserStore from "../store/user";
import { removeToken } from "../helper";

export const Nav = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const signInBtnClick = () => {
    closeMobileMenu();
    navigate("/signin");
  };

  const signUpStudentBtnClick = () => {
    closeMobileMenu();
    navigate("/signup/student");
  };

  const signUpMentorBtnClick = () => {
    closeMobileMenu();
    navigate("/signup/mentor");
  };

  const onButtonClick = () => {
    closeMobileMenu();
    removeToken();
    setUser(null);
    navigate("/");
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<AiOutlineDashboard />}>
        <NavLink className="text-base" to="/dashboard/overview">
          Dashboard
        </NavLink>
      </Menu.Item>
      <Menu.Item key="2" icon={<FaVideo />}>
        <NavLink className="text-base" to="/user-bookings">
          My Sessions
        </NavLink>
      </Menu.Item>
      <Menu.Item key="3" icon={<FiLogOut />}>
        <button onClick={onButtonClick} className="w-full text-base text-left">
          Logout
        </button>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="bg-black border-b border-purple-900/30">
      <div className="px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center">
            <NavLink to="/" className="inline-flex items-center mr-8">
              <img className="w-48" src={logo} alt="logo" />
            </NavLink>
          </div>
          <div className="flex items-center gap-4">
            {!user ? (
              <ul className="items-center hidden space-x-8 lg:flex">
                <li>
                  <button
                    onClick={signUpMentorBtnClick}
                    className="h-12 px-6 font-medium tracking-wide text-gray-100 transition-colors duration-200 border border-gray-600 rounded hover:bg-white hover:text-black"
                  >
                    Become a Mentor with Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={signInBtnClick}
                    className="font-medium tracking-wide text-gray-100 transition-colors duration-200 hover:text-[#00DFBD]"
                  >
                    Sign in
                  </button>
                </li>
                <li>
                  <button
                    onClick={signUpStudentBtnClick}
                    className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 bg-purple-600 rounded shadow-md hover:bg-purple-700 focus:shadow-outline focus:outline-none"
                  >
                    Sign up
                  </button>
                </li>
              </ul>
            ) : (
              <div className="hidden lg:block">
                <Dropdown overlay={menu} trigger={["hover"]}>
                  <button className="flex items-center justify-center font-medium tracking-wide text-gray-300 transition-colors duration-200 border border-white rounded-full w-9 h-9 hover:text-white">
                    <FaUser className="text-white" />
                  </button>
                </Dropdown>
              </div>
            )}

            {/* Hamburger toggle - only visible below lg breakpoint */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="flex items-center justify-center w-9 h-9 text-gray-200 lg:hidden"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown panel */}
        {isMobileMenuOpen && (
          <div className="pt-4 mt-4 border-t border-gray-700 lg:hidden">
            {!user ? (
              <ul className="flex flex-col gap-3">
                <li>
                  <button
                    onClick={signUpMentorBtnClick}
                    className="w-full h-12 px-6 font-medium tracking-wide text-left text-gray-100 transition-colors duration-200 border border-gray-600 rounded hover:bg-white hover:text-black"
                  >
                    Become a Mentor with Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={signInBtnClick}
                    className="w-full px-2 py-2 font-medium tracking-wide text-left text-gray-100 transition-colors duration-200 hover:text-[#00DFBD]"
                  >
                    Sign in
                  </button>
                </li>
                <li>
                  <button
                    onClick={signUpStudentBtnClick}
                    className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 bg-purple-600 rounded shadow-md hover:bg-purple-700"
                  >
                    Sign up
                  </button>
                </li>
              </ul>
            ) : (
              <ul className="flex flex-col gap-1">
                <li>
                  <NavLink
                    to="/dashboard/overview"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-2 py-3 font-medium tracking-wide text-gray-100 hover:text-[#00DFBD]"
                  >
                    <AiOutlineDashboard /> Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/user-bookings"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-2 py-3 font-medium tracking-wide text-gray-100 hover:text-[#00DFBD]"
                  >
                    <FaVideo /> My Sessions
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={onButtonClick}
                    className="flex items-center w-full gap-3 px-2 py-3 font-medium tracking-wide text-left text-gray-100 hover:text-[#00DFBD]"
                  >
                    <FiLogOut /> Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
