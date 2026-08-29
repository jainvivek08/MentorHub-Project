import { NavLink, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { Dropdown, Menu } from "antd";
import { AiOutlineDashboard } from "react-icons/ai";
import { FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { FaVideo } from "react-icons/fa";
import logo from "../assets/logo-no-background.png";
import useUserStore from "../store/user";
import useThemeStore from "../store/theme";
import { removeToken } from "../helper";

export const Nav = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const { isDark, toggleTheme } = useThemeStore();

  const signInBtnClick = () => {
    navigate("/signin");
  };

  const signUpStudentBtnClick = () => {
    navigate("/signup/student");
  };

  const signUpMentorBtnClick = () => {
    navigate("/signup/mentor");
  };

  const onButtonClick = () => {
    removeToken();
    setUser(null);
    navigate("/");
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<AiOutlineDashboard />}>
        <NavLink className="text-base" to="/dashboard/profile">
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
    <div className="bg-gray-900 dark:bg-black">
      <div className="px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center">
            <NavLink to="/" className="inline-flex items-center mr-8">
              <img className="w-48" src={logo} alt="logo" />
            </NavLink>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="flex items-center justify-center w-9 h-9 text-gray-200 transition-colors duration-200 border border-gray-600 rounded-full hover:text-white hover:border-white"
            >
              {isDark ? <FiSun /> : <FiMoon />}
            </button>
            {!user ? (
              <ul className="items-center hidden space-x-8 lg:flex">
                <li>
                  <button
                    onClick={signUpMentorBtnClick}
                    className="h-12 px-6 font-medium tracking-wide text-gray-100 transition-colors duration-200 border rounded hover:bg-white hover:text-black"
                  >
                    Become a Mentor with Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={signInBtnClick}
                    className="font-medium tracking-wide text-gray-100 transition-colors duration-200 hover:text-teal-400"
                  >
                    Sign in
                  </button>
                </li>
                <li>
                  <button
                    onClick={signUpStudentBtnClick}
                    className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 bg-purple-400 rounded shadow-md hover:bg-purple-700 focus:shadow-outline focus:outline-none"
                  >
                    Sign up
                  </button>
                </li>
              </ul>
            ) : (
              <Dropdown overlay={menu} trigger={["hover"]}>
                <button className="flex items-center justify-center font-medium tracking-wide text-gray-600 transition-colors duration-200 border border-white rounded-full w-9 h-9 hover:text-black">
                  <FaUser className="text-white" />
                </button>
              </Dropdown>
            )}
          </div>

          <div className="lg:hidden"></div>
        </div>
      </div>
    </div>
  );
};
