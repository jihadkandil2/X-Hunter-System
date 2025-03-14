import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Optionally remove any other keys as needed.
    navigate("/");
  };

  return (
    <nav className="bg-[#051527] text-white py-2">
      <div className="w-full px-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xl font-bold">X-Hunter</span>
        </div>

        {/* Hamburger (Mobile) */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/home" className="hover:text-gray-300">Home</Link>
          <Link to="/labs/opened" className="hover:text-gray-300">Opened labs</Link>
          <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link to="/about" className="hover:text-gray-300">About us</Link>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-[#5DB717] text-white font-semibold px-2 py-1 rounded-md hover:bg-green-600 flex items-center"
          >
            Log out
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center gap-1 hover:text-gray-300"
            >
              <FaUser className="text-gray-500" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md z-10">
                <Link
                  to="/update-account"
                  className="block px-4 py-2 hover:bg-gray-200"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Update Account
                </Link>
                <Link
                  to="/delete-account"
                  className="block px-4 py-2 hover:bg-gray-200"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Delete Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0F2839] p-4">
          <Link to="/home" className="block py-2 hover:text-gray-300">Home</Link>
          <Link to="/labs/opened" className="block py-2 hover:text-gray-300">Opened labs</Link>
          <Link to="/dashboard" className="block py-2 hover:text-gray-300">Dashboard</Link>
          <Link to="/about" className="block py-2 hover:text-gray-300">About us</Link>
          
          {/* Mobile Logout Button */}
          <button
            onClick={handleLogout}
            className="block py-2 bg-green-500 text-white font-semibold px-2 rounded-md hover:bg-green-600 w-full text-left"
          >
            Log out
          </button>

          {/* Profile links (Mobile) */}
          <p className="mt-3 text-gray-300">Profile</p>
          <Link
            to="/update-account"
            className="block py-1 pl-4 hover:text-gray-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Update Account
          </Link>
          <Link
            to="/delete-account"
            className="block py-1 pl-4 hover:text-gray-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Delete Account
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
