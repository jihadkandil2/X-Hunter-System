// Labdetails.js
import React from "react";

function Labdetails({ labScenario, labLevel, labDescription }) {
  return (
    <div className="mx-auto w-[40%] bg-[#0b132b] text-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Lab: {labScenario}</h2>
      <p className="text-lg font-semibold mb-2">{labLevel}</p>
      <p className="text-sm text-gray-200 mb-6">{labDescription}</p>
      <button className="bg-[#5DB717] hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg">
        Access Lab
      </button>
    </div>
  );
}

export default Labdetails;