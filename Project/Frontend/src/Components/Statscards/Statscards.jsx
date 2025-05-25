import React from "react";
import { FaUser, FaDesktop, FaUserSlash } from "react-icons/fa";
import "./Statscards.css";

const Statscards = ({
  totalUsers,
  totalUsersMonthGrowth,
  inactiveUsers,
  inactiveUsersMonthChange,
  activeNow,
}) => {
  return (
    <div className="stats-container">
      {/* Total Users */}
      <div className="stat-card">
        <div className="icon-section">
          <FaUser className="stat-icon green" />
        </div>
        <div className="text-section">
          <p className="stat-label">Total users using system</p>
          <h2 className="stat-value">{totalUsers}</h2>
          <p className="stat-change green">+{totalUsersMonthGrowth}% this month</p>
        </div>
      </div>

      <div className="divider" />

      {/* Inactive Users */}
      <div className="stat-card">
        <div className="icon-section">
          <FaUserSlash className="stat-icon pink" />
        </div>
        <div className="text-section">
          <p className="stat-label">Members disactive for a month</p>
          <h2 className="stat-value">{inactiveUsers}</h2>
          <p className="stat-change pink">{inactiveUsersMonthChange}% this month</p>
        </div>
      </div>

      <div className="divider" />

      {/* Active Now */}
      <div className="stat-card">
        <div className="icon-section">
          <FaDesktop className="stat-icon green" />
        </div>
        <div className="text-section">
          <p className="stat-label">Active Now</p>
          <h2 className="stat-value">{activeNow}</h2>
        </div>
      </div>
    </div>
  );
};

export default Statscards;
