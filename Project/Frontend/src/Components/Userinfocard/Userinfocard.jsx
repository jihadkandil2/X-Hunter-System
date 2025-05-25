import React from "react";

const Userinfocard = ({ username, rank, avatar }) => {
  return (
    <div className="bg-[#0b0f12] text-white p-4 rounded-xl flex flex-col items-center shadow-lg w-full md:w-1/4">
      <img
        src={avatar}
        alt="User Avatar"
        className="w-24 h-24 rounded-full border-2 border-green-500 mb-4"
      />
      <h2 className="text-xl font-bold">{username}</h2>
      <p className="text-green-400 text-sm">{rank}</p>
    </div>
  );
};

export default Userinfocard;
