import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

axios.defaults.withCredentials = true;

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [updatedEvent, setUpdatedEvent] = useState({
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    location: "",
    photos: [],
  });
  const [isRegistered, setIsRegistered] = useState(false);

  const { useroradminrole, userId } = useContext(UserContext);
  const navigate = useNavigate();

  const PhotosAfterUpdation = [...updatedEvent.photos, ...addedPhotos];

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/auth/events/${id}`);
        setEvent(response.data);
        setUpdatedEvent({
          ...response.data,
          location: response.data.location || "",
          startTime: response.data.startTime || "",
          endTime: response.data.endTime || "",
        });
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    try {
      const res = await axios.post("/api/auth/upload-photos", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAddedPhotos((prev) => [...prev, ...res.data]);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload photos. Please try again.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ...updatedEvent,
        photos: PhotosAfterUpdation,
      };
      const response = await axios.put(`/api/auth/events/${id}`, formData);
      setEvent(response.data);
      setEditMode(false);
      alert("Event updated successfully!");
      navigate("/upcomingevents");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`/api/auth/events/${id}`);
        alert("Event deleted successfully!");
        navigate("/");
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event.");
      }
    }
  };

  const handleRegister = async () => {
    try {
      const result = await axios.post("/api/auth/register-event", { eventId: id });
      
      setIsRegistered(true);
      navigate("/registered-events");
      console.log(result.data.message);
      alert(result.data.message);
    } catch (error) {
      console.error("Error registering for the event:", error);
      alert("Failed to register for the event.");
    }
  };

  if (!event) {
    return <p className="text-center text-lg text-blue-500 font-medium">Loading...</p>;
  }

  return (
    <div className="event-details p-6 bg-gray-50 shadow-lg rounded-lg max-w-5xl mx-auto mt-10">
      {!editMode ? (
        <>
          <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">{event.name}</h1>
          <div className="text-lg font-medium mb-8 space-y-4">
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Location:</strong> {event.location || "Not specified"}</p>
            <p><strong>Start Time:</strong> {event.startTime || "Not specified"}</p>
            <p><strong>End Time:</strong> {event.endTime || "Not specified"}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {event.photos.map((photo, index) => (
              <img
                key={index}
                src={`https://emh-backend.onrender.com${photo}`}
                alt={`Event Photo ${index}`}
                className="w-full h-64 object-cover rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>

          {useroradminrole === "admin" && (
            <div className="text-center mt-6">
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 mr-4"
                onClick={() => setEditMode(true)}
              >
                Edit Event
              </button>
              <button
                className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete Event
              </button>
            </div>
          )}

          {useroradminrole === "user" && !isRegistered && (
            <div className="text-center mt-6">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700"
                onClick={handleRegister}
              >
                Register for Event
              </button>
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium">Event Name:</label>
              <input
                type="text"
                name="name"
                value={updatedEvent.name}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-lg font-medium">Date:</label>
              <input
                type="date"
                name="date"
                value={updatedEvent.date}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-lg font-medium">Start Time:</label>
              <input
                type="time"
                name="startTime"
                value={updatedEvent.startTime}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-lg font-medium">End Time:</label>
              <input
                type="time"
                name="endTime"
                value={updatedEvent.endTime}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-lg font-medium">Description:</label>
              <textarea
                name="description"
                value={updatedEvent.description}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-lg font-medium">Location:</label>
              <input
                type="text"
                name="location"
                value={updatedEvent.location}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {PhotosAfterUpdation.map((photo, index) => (
                <img
                  key={index}
                  src={`https://emh-backend.onrender.com${photo}`}
                  alt={`Updated Photo ${index}`}
                  className="w-full h-64 object-cover rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
                />
              ))}
            </div>

            <div>
              <label className="block text-lg font-medium">Add Photos:</label>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-center space-x-6 mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update Event
            </button>
            <button
              type="button"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EventDetails;
