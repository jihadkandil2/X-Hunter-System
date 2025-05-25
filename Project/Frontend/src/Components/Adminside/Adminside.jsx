import React, { useState } from "react";
import { FaHome, FaChartBar, FaTools, FaComments, FaSignOutAlt, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Adminside.css";

const Adminside = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`} >
      <div className="toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </div>

      <ul className="sidebar-menu">
        <li>
          <Link to="/dashboard">
            <FaChartBar />
            {isOpen && <span>Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link to="/manage-labs">
            <FaTools />
            {isOpen && <span>Manage Labs</span>}
          </Link>
        </li>
        <li>
          <Link to="/generate-labs">
            <FaComments />
            {isOpen && <span>Geneate Labs</span>}
          </Link>
        </li>
        <li>
          <Link to="/home">
            <FaHome />
            {isOpen && <span>Home</span>}
          </Link>
        </li>
        <li onClick={handleLogout}>
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </li>
      </ul>
    </div>
  );
};

export default Adminside;
