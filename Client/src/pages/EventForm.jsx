import React, { useState, useContext } from "react";
import axios from "axios";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const EventForm = () => {
  const [event, setEvent] = useState({
    name: "",
    date: "",
    description: "",
    photos: [],
    location: "", 
    startTime: "", 
    endTime: "", 
    category: "", 
  });

  const navigate = useNavigate();
  const { user, setUser, useroradminrole, setuseroradminrole } =
    useContext(UserContext);
  const [addedphotos, setaddedphotos] = useState([]);
  console.log(addedphotos);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const uploadImages = (e) => {
    e.preventDefault();
    const files = e.target.files;
    if (!files.length) return;

    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    axios
      .post("/api/auth/upload-photos", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        const { data: filenames } = res;
        setaddedphotos((prev) => [...prev, ...filenames]);
        setEvent((prevEvent) => ({
          ...prevEvent,
          photos: [...prevEvent.photos, ...filenames],
        }));
      })
      .catch((err) => {
        console.error("Error uploading files:", err);
        alert("Failed to upload files. Please try again.");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/auth/events",
        event
      );
      alert("Event added successfully!");
      setEvent({
        name: "",
        date: "",
        description: "",
        photos: [],
        location: "",
        startTime: "",
        endTime: "",
        category: "",
      });
      setaddedphotos([]);
      navigate("/upcomingevents");
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event.");
    }
  };

  return (
    <>
      <h1 className="text-center text-2xl font-bold animate__animated animate__fadeIn">
        Admin can only Edit or delete this Event
      </h1>

      {useroradminrole === "admin" ? (
        <div className="event-form p-6 animate__animated animate__fadeIn animate__delay-1s">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Add New Event
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Event Name</label>
              <input
                type="text"
                name="name"
                value={event.name}
                onChange={handleChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Date</label>
              <input
                type="date"
                name="date"
                value={event.date}
                onChange={handleChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={event.description}
                onChange={handleChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* New Location Field */}
            <div>
              <label className="block text-sm font-medium">Location</label>
              <input
                type="text"
                name="location"
                value={event.location}
                onChange={handleChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* New Start Time Field */}
            <div>
              <label className="block text-sm font-medium">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={event.startTime}
                onChange={handleChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* New End Time Field */}
            <div>
              <label className="block text-sm font-medium">End Time</label>
              <input
                type="time"
                name="endTime"
                value={event.endTime}
                onChange={handleChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* New Category Field */}
            <div>
              <label className="block text-sm font-medium">Category</label>
              <input
                type="text"
                name="category"
                value={event.category}
                onChange={handleChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <div className="mt-2 gap-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                {addedphotos.length > 0 &&
                  addedphotos.map((link, index) => (
                    <div key={index} className="flex justify-center">
                      <img
                        src={`https://emh-backend.onrender.com${link}`}
                        alt="Event"
                        className="w-full h-48 object-cover rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                      />
                    </div>
                  ))}
                <label className="flex justify-center items-center gap-2 border bg-transparent rounded-2xl p-4 mb-2 cursor-pointer transition duration-300 ease-in-out hover:bg-gray-100">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={uploadImages}
                  />
                  <span>Upload</span>
                </label>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
              >
                Add Event
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center text-xl text-red-600 animate__animated animate__fadeIn animate__delay-2s">
          Only admin can edit this Event
        </div>
      )}
    </>
  );
};

export default EventForm;
