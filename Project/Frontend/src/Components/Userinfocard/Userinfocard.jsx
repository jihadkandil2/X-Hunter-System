import React from "react";

const Userinfocard = ({ username, rank, avatar }) => {
  return (
    <div className="flex flex-col items-center min-w-[180px]">
      <img
        src={avatar}
        alt="User Avatar"
        className="w-24 h-24 rounded-full border-2 border-green-500 object-cover"
      />
      <h2 className="text-md font-bold text-white mt-2">{username}</h2>
      <p className="text-green-400 text-sm font-semibold">R: {rank}</p>
    </div>
  );
};

export default Userinfocard;