import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "./Navbar.css"; // استيراد ملف CSS

function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">X-Hunter</div>

        {/* روابط التنقل */}
        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/labs/opened">Opened labs</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/about">About us</Link>

          {/* زر تسجيل الخروج */}
          <button onClick={handleLogout} className="logout-btn">
            Log out
          </button>

          {/* قائمة الحساب الشخصي */}
          <div className="profile-menu relative">
            <button onClick={toggleProfileMenu} className="profile-icon">
              <FaUser className="icon" />
            </button>
            {isProfileOpen && (
              <div className="dropdown-menu">
                <Link to="/manage-labs" onClick={() => setIsProfileOpen(false)}>Manage Labs</Link>
                <Link to="/generate-labs" onClick={() => setIsProfileOpen(false)}>Generate Labs</Link>
                <Link to="/update-account" onClick={() => setIsProfileOpen(false)}>Update Account</Link>
                <Link to="/delete-account" onClick={() => setIsProfileOpen(false)}>Delete Account</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
