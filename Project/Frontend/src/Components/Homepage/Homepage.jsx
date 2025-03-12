import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Labitem from "../Labitem/labitem";

function Homepage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div
          className={`
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? "w-80" : "w-12"} // عرض الشريط الجانبي
            hidden md:block // إخفاء الشريط الجانبي على الشاشات الصغيرة
          `}
        >
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Lab Items */}
        <div
          className={`
            flex-1 p-4 overflow-y-auto
            ${isSidebarOpen ? "pr-12" : "pr-80"} // ضبط الهامش الأيمن بشكل معاكس لحالة الشريط الجانبي
            transition-all duration-300 ease-in-out
          `}
        >
          <div className="grid grid-cols-1 gap-4">
            <h3 className="text-white">SQL</h3>
            <Labitem solved={true} />
            <Labitem solved={false} />
            <Labitem solved={true} />
            <h3 className="text-white">XSS</h3>
            <Labitem solved={true} />
            <Labitem solved={false} />
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;