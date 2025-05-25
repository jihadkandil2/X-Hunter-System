import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // إغلاق جميع القوائم عند النقر خارجها
  const closeAllDropdowns = () => {
    setIsHomeDropdownOpen(false);
    setIsProfileOpen(false);
  };

  // إغلاق القوائم عند النقر في أي مكان في الصفحة
  useEffect(() => {
    document.addEventListener("click", closeAllDropdowns);
    return () => document.removeEventListener("click", closeAllDropdowns);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar bg[0C1317]">
      <div className="navbar-container">
        <div className="logo">X-Hunter</div>

        <div className="nav-links">
          {/* Home Dropdown */}
          <div className="dropdown-container">
            <button 
              onClick={(e) => {
                e.stopPropagation(); // منع انتشار الحدث
                setIsHomeDropdownOpen(!isHomeDropdownOpen);
              }}
              className="dropdown-trigger"
            >
              All labs
            </button>
            
            {isHomeDropdownOpen && (
              <div 
                className="dropdown-menu"
                onClick={(e) => e.stopPropagation()} // منع إغلاق القائمة عند النقر داخلها
              >
                <Link to="/home" onClick={closeAllDropdowns}>All labs</Link>
                <Link to="/labs/opened" onClick={closeAllDropdowns}>Opened labs</Link>
              </div>
            )}
          </div>

          <Link to="/dashboard">Dashboard</Link>
          <Link to="/about">About us</Link>

          <button onClick={handleLogout} className="logout-btn">
            Log out
          </button>

          {/* Profile Dropdown */}
          <div className="profile-menu">
            <button 
              onClick={(e) => {
                e.stopPropagation(); // منع انتشار الحدث
                setIsProfileOpen(!isProfileOpen);
              }} 
              className="profile-icon"
            >
              <FaUser className="icon" />
            </button>
            {isProfileOpen && (
              <div 
                className="dropdown-menu"
                onClick={(e) => e.stopPropagation()}
              >
                <Link to="/update-account" onClick={closeAllDropdowns}>Update Account</Link>
                <Link to="/delete-account" onClick={closeAllDropdowns}>Delete Account</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;