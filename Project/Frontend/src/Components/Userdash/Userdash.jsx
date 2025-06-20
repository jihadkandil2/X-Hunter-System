import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import ProblemSolvingChart from "../ProblemSolvingChart/ProblemSolvingChart";
import Heatmapcard from "../Heatmapcard/Heatmapcard";
import "../Homepage/Homepage.css";
import Userinfocard from "../Userinfocard/Userinfocard";

const Userdash = () => {
  const [stats, setStats] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [heatmapStats, setHeatmapStats] = useState({});
  const [userData, setUserData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/solved/getByUserId", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const responseData = res.data || {};

        const solvedPercentage = {
          Easy: parseFloat(responseData?.solvedPercentage?.Easy || 0),
          Medium: parseFloat(responseData?.solvedPercentage?.Medium || 0),
          Hard: parseFloat(responseData?.solvedPercentage?.Hard || 0),
        };

        const activityMap = responseData.activityMap || {};
        const heatmapArray = Object.entries(activityMap).map(([date, count]) => ({ date, count }));

        const username = responseData.userName || "User";

        setStats({ solvedPercentage });
        setHeatmapData(heatmapArray);
        setUserData({
          username,
          rank: responseData.rank || "Newbie",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        });
      } catch (err) {
        console.error("❌ Error fetching user dashboard:", err);
        setStats({ solvedPercentage: { Easy: 0, Medium: 0, Hard: 0 } });
        setHeatmapData([]);
        setUserData({
          username: "User",
          rank: "Newbie",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=User`,
        });
      }
    };

    fetchUserStats();
  }, []);

  useEffect(() => {
    if (!heatmapData || !heatmapData.length) {
      setHeatmapStats({
        totalAllTime: 0,
        totalLastYear: 0,
        totalLastMonth: 0,
        streakAllTime: 0,
        streakLastYear: 0,
        streakLastMonth: 0,
      });
      return;
    }

    const parseDate = (dateStr) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const filtered = heatmapData.filter((entry) => {
      const year = new Date(entry.date).getFullYear();
      return year === selectedYear;
    });

    const activitySet = new Set(filtered.map((entry) => entry.date));
    const sortedDates = [...filtered.map(entry => entry.date)].sort();

    let streakAllTime = 0;
    let streakLastMonth = 0;

    if (sortedDates.length > 0) {
      const today = new Date();
      const lastMonth = new Date(today);
      lastMonth.setDate(today.getDate() - 30);

      const calculateStreak = (startDate, minDate = null) => {
        let current = parseDate(startDate);
        let count = 0;
        while (activitySet.has(formatDate(current))) {
          if (minDate && current < minDate) break;
          count++;
          current.setDate(current.getDate() - 1);
        }
        return count;
      };

      const lastActivity = sortedDates[sortedDates.length - 1];
      streakAllTime = calculateStreak(lastActivity);
      streakLastMonth = calculateStreak(lastActivity, lastMonth);
    }

    setHeatmapStats({
      totalAllTime: filtered.length,
      totalLastYear: filtered.length,
      totalLastMonth: filtered.filter(entry => {
        const d = parseDate(entry.date);
        const today = new Date();
        const lastMonth = new Date(today);
        lastMonth.setDate(today.getDate() - 30);
        return d >= lastMonth && d <= today;
      }).length,
      streakAllTime,
      streakLastYear: streakAllTime,
      streakLastMonth,
    });
  }, [heatmapData, selectedYear]);

  if (!stats || !userData) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="homepage-background min-h-screen">
      <Navbar />
      <div className="flex flex-col min-h-screen z-10 text-white space-y-10 p-6">
        <div className="flex flex-row items-center gap-8">
          <Userinfocard
            username={userData.username}
            rank={userData.rank}
            avatar={userData.avatar}
          />
          <div className="flex-grow">
            <ProblemSolvingChart
              easy={stats.solvedPercentage.Easy}
              medium={stats.solvedPercentage.Medium}
              hard={stats.solvedPercentage.Hard}
            />
          </div>
        </div>

        <div className="ml-4 md:ml-32">
          <Heatmapcard
            heatmapData={heatmapData}
            stats={heatmapStats}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>
      </div>
    </div>
  );
};

export default Userdash;
