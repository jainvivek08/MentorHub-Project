import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Nav } from "../../components/Nav";
import { FiMenu } from "react-icons/fi";

const Dashboard = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Nav />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 mt-4 ml-4 text-sm font-medium text-gray-700 border rounded-lg md:hidden hover:bg-gray-100"
          >
            <FiMenu className="text-lg" /> Menu
          </button>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
