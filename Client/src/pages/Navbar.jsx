import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import axios from "axios";
axios.defaults.withCredentials = true;

function Navbar() {
  const { user, setUser, useroradminrole, setuseroradminrole } = useContext(UserContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 
  const [currentLink, setCurrentLink] = useState(""); 

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      setuseroradminrole(null);
      navigate("/");
      window.location.reload()
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLinkClick = (link) => {
    setCurrentLink(link); 
    setMobileMenuOpen(false); 
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold transition duration-300 hover:text-blue-200">Event_Hub</h1>

      <div className="space-x-6 items-center hidden md:flex">
        <Link to="/" className="hover:underline hover:text-blue-300 transition duration-300">Home</Link>

        {useroradminrole === "admin" && (
          <Link to="/create-event" className="hover:underline hover:text-blue-300 transition duration-300">Create Event</Link>
        )}

        {!user && (
          <>
            <Link to="/login" className="hover:underline hover:text-blue-300 transition duration-300">User Login</Link>
            <Link to="/adminlogin" className="hover:underline hover:text-blue-300 transition duration-300">Admin Login</Link>
          </>
        )}

        {user && (
          <div className="flex items-center space-x-4 ml-4">
            <span className="text-sm text-white">
              Logged in as: <strong>{useroradminrole} - {user}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="md:hidden flex items-center">
        <button className="text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full bg-blue-600 text-white p-4 space-y-4">
          <Link
            to="/"
            className={`block hover:underline hover:text-blue-300 transition duration-300 ${currentLink === "home" ? "text-blue-300" : ""}`}
            onClick={() => handleLinkClick("home")}
          >
            Home
          </Link>

          {useroradminrole === "admin" && (
            <Link
              to="/create-event"
              className={`block hover:underline hover:text-blue-300 transition duration-300 ${currentLink === "create-event" ? "text-blue-300" : ""}`}
              onClick={() => handleLinkClick("create-event")}
            >
              Create Event
            </Link>
          )}

          {!user && (
            <>
              <Link
                to="/login"
                className={`block hover:underline hover:text-blue-300 transition duration-300 ${currentLink === "login" ? "text-blue-300" : ""}`}
                onClick={() => handleLinkClick("login")}
              >
                User Login
              </Link>
              <Link
                to="/adminlogin"
                className={`block hover:underline hover:text-blue-300 transition duration-300 ${currentLink === "adminlogin" ? "text-blue-300" : ""}`}
                onClick={() => handleLinkClick("adminlogin")}
              >
                Admin Login
              </Link>
            </>
          )}

          {user && (
            <div className="flex flex-col space-y-2">
              <span className="text-sm text-white">
                Logged in as: <strong>{useroradminrole} - {user}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition duration-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
