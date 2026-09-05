import React from "react";
import Footer from "./Footer"; // Assuming Footer is your bottom footer component
import { Nav } from "./Nav";
import ChatbotWidget from "./ChatbotWidget";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at the top */}
      <header>
        <Nav />
      </header>

      {/* Main content in between */}
      <main className="flex-grow">{children}</main>

      {/* Footer at the bottom */}
      <footer>
        <Footer />
      </footer>

      {/* Floating AI chatbot, shows on every page that uses this Layout */}
      <ChatbotWidget />
    </div>
  );
};

export default Layout;