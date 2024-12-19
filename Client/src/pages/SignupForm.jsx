import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); 
  const [message, setMessage] = useState("");
  const navigate = useNavigate()
  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post(
        "/api/auth/userregister",
        { email, password, role }
      );
      setMessage(response.data.message);
      alert("You Can Login now to View The Events")
      navigate("/login")
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong during signup."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600 transition duration-300 hover:text-blue-800">
          Signup
        </h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-300 hover:border-blue-500"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-300 hover:border-blue-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-300 hover:border-blue-500"
          >
            <option value="user">User</option>
            {/* <option value="admin">Admin</option> */}
          </select>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Signup
          </button>
          <span className="block text-center mt-2 text-sm text-gray-600">
            Already a user? <a href="/login" className="text-blue-500 hover:underline">Login</a>
          </span>
        </form>
        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default SignupForm;

