import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import DashboardNavbar from "../../components/DashboardNavbar";

const Dashboard = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0">{children}</main>
      </div>
    </div>
  );
};

export default Dashboard;
