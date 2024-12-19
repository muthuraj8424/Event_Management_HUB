
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import UserContext from "../context/UserContext";

const RegisteredEvents = () => {
  const { userId } = useContext(UserContext); // Access userId from context
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const response = await axios.get(`/api/auth/registered-events`);
        
        console.log(response.data);

        // Filter out invalid events where eventId is null
        if (response.data && Array.isArray(response.data)) {
          const events = response.data
            .filter((registration) => registration.eventId !== null)
            .map((registration) => registration.eventId);
          setRegisteredEvents(events);
        } else {
          setError(response.data.message);
        }

        setLoading(false); // Stop loading after data is fetched
      } catch (error) {
        console.error("Error fetching registered events:", error);
        setError("Failed to load registered events. Please try again.");
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchRegisteredEvents();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-blue-500 animate-pulse">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-red-500 font-semibold text-xl">{error}</p>
        <div className="mt-4">
          <Link
            to="/upcomingevents"
            className="text-blue-600 hover:underline font-semibold text-lg"
          >
            View Upcoming Events
          </Link>
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
     <div className="max-w-screen-xl mx-auto px-4 py-8">
  <h1 className="text-3xl md:text-5xl font-extrabold text-center text-gray-800 mb-8 md:mb-12">
    Your Registered Events
  </h1>
  <Link
    to="/upcomingevents"
    className="text-xl md:text-3xl font-extrabold text-center text-gray-500 mb-8 md:mb-12 hover:text-gray-700 transition duration-300 ease-in-out"
  >
    View Upcoming Events
  </Link>
</div>

      {registeredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {registeredEvents.map((event) => {
            // Ensure the event object exists before rendering
            if (!event || !event.name || !event.date || !event.location) {
              return null; // Skip invalid events
            }
            return (
              <div
                key={event._id}
                className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-blue-600 mb-2 truncate">
                    {event.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-1">
                    Date: {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    Location: {event.location}
                  </p>
                  <Link
                    to={`/event/${event._id}`}
                    className="inline-block text-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg">
          You haven’t registered for any events yet.
          <div className="mt-4">
            <Link
              to="/upcomingevents"
              className="text-blue-600 hover:underline font-semibold text-lg"
            >
              View Upcoming Events
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredEvents;