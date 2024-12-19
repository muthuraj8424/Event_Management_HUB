
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;
import UserContext from "../context/UserContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); 
  const [message, setMessage] = useState("");
  const { setUser, setuseroradminrole } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post(
        "/api/auth/userlogin",
        { email, password, role }
      );
      setMessage("Login successful!");
      console.log(response.data);
      setUser(response.data.user); 
      setuseroradminrole(response.data.role);
      navigate("/");
      window.location.reload()
      
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong during login."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 animate__animated animate__fadeIn">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 animate__animated animate__fadeIn animate__delay-1s">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          >
            Login
          </button>
          <div className="text-center">
            <span>Don't have an account? </span>
            <a href="/signup" className="text-blue-600 hover:underline">
              Signup
            </a>
          </div>
        </form>
        {message && (
          <p className="mt-4 text-center text-red-600 animate__animated animate__fadeIn animate__delay-2s">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;

