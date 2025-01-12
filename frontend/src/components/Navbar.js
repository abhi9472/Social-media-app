import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status from localStorage or other auth mechanism
  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Example token check
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    // Clear auth token
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/"); // Redirect to home
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Home Button */}
        <Link to="/" className="text-xl font-bold hover:text-gray-300">
          Home
        </Link>

        {/* Auth Buttons */}
        <div>
          {!isLoggedIn ? (
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Signup
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
