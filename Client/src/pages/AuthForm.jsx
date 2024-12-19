import React, { useState } from "react";
import axios from "axios";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role is 'user'
  const [message, setMessage] = useState("");
  const [isSignup, setIsSignup] = useState(true); // To toggle between signup and login

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        // Signup logic
        const response = await axios.post(
          "/api/auth/userregister",
          {
            email,
            password,
            role,
          }
        );
        setMessage(response.data.message);
        console.log(response.data.message); // Ensure you handle the message correctly
      } else {
        // Login logic
        const response = await axios.post(
          "/api/auth/userlogin",
          {
            email,
            password,
            role,
          }
        );
        setMessage(response.data.message);
        console.log(response.data.message);
        
      }
    } catch (error) {
      setMessage(
        error.response ? error.response.data.message : "Something went wrong"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isSignup ? "Signup" : "Login"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isSignup ? (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              {/* <option value="admin">Admin</option>
            <option value="guest">Guest</option> */}
            </select>
          ) : (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              {/* <option value="admin">Admin</option>
            <option value="guest">Guest</option> */}
            </select>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
          >
            {isSignup ? "Signup" : "Login"}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
        <div className="mt-4 text-center">
          <span>
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-blue-500 hover:underline"
            >
              {isSignup ? "Login" : "Signup"}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
