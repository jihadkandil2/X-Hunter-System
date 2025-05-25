import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import ProblemSolvingChart from "../ProblemSolvingChart/ProblemSolvingChart";
import Heatmapcard from "../Heatmapcard/Heatmapcard";
import "../Homepage/Homepage.css";

const UserInfoCard = ({ username, rank, avatar }) => {
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

const Userdash = () => {
  const [stats, setStats] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [heatmapStats, setHeatmapStats] = useState({});
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const dummyStats = {
      solvedPercentage: {
        easy: "22",
        medium: "62",
        hard: "81",
      },
    };

    const dummyHeatmapData = [
      { date: "2025-01-01", count: 1 },
      { date: "2025-01-02", count: 3 },
      { date: "2025-02-05", count: 4 },
      { date: "2025-02-06", count: 2 },
      { date: "2025-04-12", count: 6 },
    ];

    const dummyHeatmapStats = {
      totalAllTime: 151,
      totalLastYear: 0,
      totalLastMonth: 151,
      streakAllTime: 6,
      streakLastYear: 0,
      streakLastMonth: 0,
    };

    const dummyUserData = {
      username: "Seham",
      rank: "Newbie",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Seham",
    };

    setStats(dummyStats);
    setHeatmapData(dummyHeatmapData);
    setHeatmapStats(dummyHeatmapStats);
    setUserData(dummyUserData);
  }, []);

  if (!stats || !userData) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="homepage-background min-h-screen">
      <Navbar />
      <div className="flex flex-col min-h-screen z-10  text-white ">
        <div className=" rounded-xl  flex flex-row items-center">
          <UserInfoCard
            username={userData.username}
            rank={userData.rank}
            avatar={userData.avatar}
          />
          <div className="flex-grow">
            <ProblemSolvingChart
              easy={parseFloat(stats.solvedPercentage.easy)}
              medium={parseFloat(stats.solvedPercentage.medium)}
              hard={parseFloat(stats.solvedPercentage.hard)}
            />
          </div>
        </div>

       <div className="ml-32 ">
        <Heatmapcard heatmapData={heatmapData} stats={heatmapStats} />
      </div>
      </div>
    </div>
  );
};

export default Userdash;
