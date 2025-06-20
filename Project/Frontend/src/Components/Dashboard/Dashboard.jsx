import React, { useEffect, useState } from "react";
import axios from "axios";
import Statscards from "../Statscards/Statscards";
import ProblemSolvingChart from "../ProblemSolvingChart/ProblemSolvingChart";
import "../Homepage/Homepage.css";
import Adminside from "../Adminside/Adminside";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
const token = localStorage.getItem("token");

axios
  .get("http://localhost:3000/user/analyze", {
    headers: {
      Authorization: `admin ${token}`, 
    },
  })
  .then((res) => {
      console.log("✅ Dashboard response:", res.data); 
    setStats(res.data);
    setLoading(false);
  })
  .catch((err) => {
    console.error("Error fetching dashboard stats:", err);
    setLoading(false);
  });

}, []);



  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  return (
    <div className="homepage-background page-container">
      <Adminside />
      <div className=" flex-1 ml-[80px] min-h-screen z-10 p-6 text-white">
       

        <Statscards
         totalUsers={stats.totalUsers}
        /* totalUsersMonthGrowth={stats.totalUsersMonthGrowth}*/
         inactiveUsers={stats.inactiveUsers}
       /*  inactiveUsersMonthChange={stats.inactiveUsersMonthChange}*/
         activeNow={stats.activeUsers}
        />

       <ProblemSolvingChart
        easy={parseFloat(stats.solvedPercentage?.Easy) || 0}
        medium={parseFloat(stats.solvedPercentage?.Medium) || 0} 
        hard={parseFloat(stats.solvedPercentage?.Hard) || 0}
       />

      </div>
    </div>
  );
};

export default Dashboard;
