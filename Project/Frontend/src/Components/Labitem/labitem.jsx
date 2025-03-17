import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import { AiOutlineCheck } from "react-icons/ai";

function Labitem({ labLevel, labScenario, labDescription, solved = false }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(solved ? "Solved" : "Solve");

  const handleRightClick = (e) => {
    e.preventDefault();
    navigate("/fulllab", {
      state: {
        labLevel,
        labScenario,
        labDescription, // ✅ تمرير الوصف لـ FullLabPage
        currentStatus: status,
      },
    });
    if (status === "Solve") {
      setStatus("Opened");
    }
  };

  return (
    <div className="w-[80%] ml-0"> {/* هنا تم تحديد العرض بـ 80% ومحاذاته لليسار */}
      <div className="flex flex-col md:flex-row items-stretch mb-4 overflow-hidden rounded-full shadow-lg">
        {/* الجزء الأيسر */}
        <div className="bg-white text-[#1D3044] md:w-[20%] flex items-center justify-center md:rounded-l-full border-b md:border-b-0 md:border-r border-gray-300 whitespace-nowrap p-4">
          <div className="flex items-center gap-1 text-sm font-semibold">
            <FaShieldAlt />
            <span>{labLevel}</span>
          </div>
        </div>

        {/* الجزء الأوسط */}
        <div className="bg-white w-[60%] px-4 py-3 text-[#1D3044]">
          <p className="text-sm">{labScenario}</p>
        </div>

        {/* الجزء الأيمن */}
        <div
          onClick={handleRightClick}
          className={`cursor-pointer ${
            status === "Solved" ? "bg-green-600" : "bg-[#5DB717]"
          } md:w-[20%] flex items-center justify-center md:rounded-r-full p-4 transition-all`}
        >
          <div className="flex items-center gap-1 font-semibold text-white">
            <span>{status}</span>
            {status === "Solved" && <AiOutlineCheck className="text-white" />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Labitem;