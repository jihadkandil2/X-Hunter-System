import React from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import { AiOutlineCheck } from "react-icons/ai";

function Labitem({ solved }) {
  return (
    <div className="flex flex-col md:flex-row items-stretch w-full mb-4 overflow-hidden rounded-full shadow-lg mr-8"> {/* Added margin-right */}
      {/* Left Section */}
      <div className="bg-white text-[#1D3044] md:w-[20%] flex items-center justify-center md:rounded-l-full border-b md:border-b-0 md:border-r border-gray-300 whitespace-nowrap p-4">
        <div className="flex items-center gap-1 text-sm font-semibold">
          <FaShieldAlt />
          <span>Lab Level</span>
        </div>
      </div>

      {/* Middle Section */}
      <div className="bg-white flex-1 px-4 py-3 text-[#1D3044]">
        <h4 className="font-bold text-base mb-1">Vuln Name</h4>
        <p className="text-sm">This Will Be The Scenario Of The Lab</p>
      </div>

      {/* Right Section */}
      <Link
        to="/fulllab"
        className="bg-[#5DB717] md:w-[20%] flex items-center justify-center md:rounded-r-full p-4"
      >
        <div className="flex items-center gap-1 font-semibold text-white">
          <span>{solved ? "Solved" : "Solve"}</span>
          {solved && <AiOutlineCheck />}
        </div>
      </Link>
    </div>
  );
}

export default Labitem;