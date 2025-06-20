import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);
  const [selectedLabView, setSelectedLabView] = useState("All labs");

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ تحديث اسم العرض حسب الرابط الحالي
  useEffect(() => {
    if (location.pathname.includes("/labs/opened")) {
      setSelectedLabView("Opened labs");
    } else if (location.pathname.includes("/home")) {
      setSelectedLabView("All labs");
    }
  }, [location.pathname]);

  const closeAllDropdowns = () => {
    setIsHomeDropdownOpen(false);
    setIsProfileOpen(false);
  };

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
                e.stopPropagation();
                setIsHomeDropdownOpen(!isHomeDropdownOpen);
              }}
              className="dropdown-trigger"
            >
              {selectedLabView}
            </button>

            {isHomeDropdownOpen && (
              <div
                className="dropdown-menu"
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedLabView("All labs");
                    navigate("/home");
                    closeAllDropdowns();
                  }}
                >
                  All labs
                </Link>
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedLabView("Opened labs");
                    navigate("/labs/opened");
                    closeAllDropdowns();
                  }}
                >
                  Opened labs
                </Link>
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
                e.stopPropagation();
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
                <Link to="/update-account" onClick={closeAllDropdowns}>
                  Update Account
                </Link>
                <Link to="/delete-account" onClick={closeAllDropdowns}>
                  Delete Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

