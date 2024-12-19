import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Enquiry = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [enquiry, setEnquiry] = useState("");
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/enquiry", {
        name,
        email,
        enquiry,
      });
      alert("Your enquiry has been submitted!");
      setName("");
      setEmail("");
      setEnquiry("");
      navigate("/upcomingevents")
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      alert("Something went wrong, please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-3xl font-bold text-blue-600">Enquiry Page</h1>
        <p className="mt-4 text-xl text-gray-600">
          Feel free to ask any questions. We'll get back to you soon!
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            placeholder="Your Enquiry"
            value={enquiry}
            onChange={(e) => setEnquiry(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          >
            Submit Enquiry
          </button>
        </form>
      </div>
    </div>
  );
};

export default Enquiry;
