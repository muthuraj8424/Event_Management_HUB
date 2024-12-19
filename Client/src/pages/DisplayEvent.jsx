import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

axios.defaults.withCredentials = true;

const DisplayEvent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/auth/events");
        console.log(response.data);
        setEvents(response.data); 
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 animate__animated animate__fadeIn">
        Upcoming Events
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map((event) => (
          <Link
            to={`/event/${event._id}`}
            key={event._id}
            className="p-6 bg-white shadow-lg rounded-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-gray-100"
          >
            <div className="relative">
              <img
                src={`http://localhost:5000${event.photos[0]}`}
                alt="Event"
                className="w-full h-72 mb-4 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-2 text-sm rounded-bl-lg">
                {event.date}
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">{event.name}</h3>
            <p className="text-lg text-gray-600 mb-2">{event.location || "Location not available"}</p>
            <p className="text-gray-700 mb-4">{event.description.slice(0, 100)}...</p>
            <div className="flex flex-col items-start text-gray-500 space-y-2">
              <div>
                <strong className="font-semibold">Start Time:</strong> {event.startTime || "Not specified"}
              </div>
              <div>
                <strong className="font-semibold">End Time:</strong> {event.endTime || "Not specified"}
              </div>
              <div>
                <span>Added photos:</span>
                <span className="ml-1 font-semibold text-gray-900">{event.photos.length}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DisplayEvent;
