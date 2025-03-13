import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#051527] text-white py-2">
      <div className="w-full px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-xl font-bold">X-Hunter</span>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Links (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/home" className="hover:text-gray-300">
            Home
          </Link>
          <Link to="/labs/opened" className="hover:text-gray-300">
            Opened labs
          </Link>
          <Link to="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/about" className="hover:text-gray-300">
            About us
          </Link>

          {/* Log out Button */}
          <Link
            to="/logout"
            className="bg-[#5DB717] text-white font-semibold px-2 py-1 rounded-md hover:bg-green-600 flex items-center"
          >
            Log out
          </Link>

          {/* Profile Icon */}
          <Link
            to="/profile"
            className="flex items-center gap-1 hover:text-gray-300"
          >
            <FaUser className="text-gray-500" />
          </Link>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0F2839] p-4">
          <Link to="/home" className="block py-2 hover:text-gray-300">
            Home
          </Link>
          <Link to="/labs/opened" className="block py-2 hover:text-gray-300">
            Opened labs
          </Link>
          <Link to="/dashboard" className="block py-2 hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/about" className="block py-2 hover:text-gray-300">
            About us
          </Link>
          <Link
            to="/logout"
            className="block py-2 bg-green-500 text-white font-semibold px-2 rounded-md hover:bg-green-600"
          >
            Log out
          </Link>
          <Link
            to="/profile"
            className="block py-2 flex items-center gap-1 hover:text-gray-300"
          >
            <FaUser className="text-gray-500" />
            Profile
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;