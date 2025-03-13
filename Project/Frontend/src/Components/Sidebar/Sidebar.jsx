import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div
      className={`
        relative h-full bg-[#051527] p-4 flex flex-col
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-80" : "w-12"} // عرض الشريط الجانبي
        rounded-r-3xl rounded-b-3xl // زوايا مدورة
      `}
    >
      {isOpen && (
        <div className="bg-white rounded-md flex items-center px-2 py-1 mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 outline-none text-black"
          />
          <FaSearch className="text-gray-500 ml-2" />
        </div>
      )}

      <div className="flex-1 mt-2">
        {/* Place your sidebar content/links here */}
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-16 right-0 transform translate-x-1/2 w-8 h-8 rounded-full bg-gray-400 text-black flex items-center justify-center shadow-md"
      >
        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
    </div>
  );
}

export default Sidebar;