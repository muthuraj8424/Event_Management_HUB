import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { user, useroradminrole ,username,message} = useContext(UserContext);
  const navigate = useNavigate(); 

  const handleUpcomingEventsClick = () => {
    if (user) {
      navigate("/upcomingevents");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r bg-slate-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6 w-full whitespace-nowrap">
          Welcome to Event-HUB
        </h1>
        {user ? (
          <p className="text-lg text-gray-700 mb-6 text-center">
            Hello, <span className="font-semibold">{username}</span>! You are logged
            in as <span className="font-semibold">{useroradminrole==="admin"?"Admin":"Guest"}</span>.
          </p>
        ) : (
          <p className="text-lg font-bold text-gray-600 mb-6 text-center">
            {message}
          </p>
        )}
        <div className="flex flex-col space-y-4">
          {user && useroradminrole === "admin" ? (
            <>
              <Link
                to="/create-event"
                className="py-3 px-6 bg-green-800 text-white rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition duration-300 transform hover:scale-105 text-center"
              >
                Create Event
              </Link>
              <Link
                to="/upcomingevents"
                className="py-3 px-6 bg-green-800 text-white rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition duration-300 transform hover:scale-105 text-center"
              >
                Update Events
              </Link>
            </>
          ) : (
            <>
              {user && <Link
                to="/enquiry"
                className="py-3 px-6 bg-blue-800 text-white rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-300 transform hover:scale-105 text-center"
              >
                Go to Enquiry Page
              </Link>}
              <button
                onClick={handleUpcomingEventsClick} 
                className="py-3 px-6 bg-purple-800 text-white rounded-lg shadow-md hover:bg-purple-700 hover:shadow-lg transition duration-300 transform hover:scale-105 text-center"
              >
                View Upcoming Events
              </button>
              {!user && (<Link
                to="/signup"
                className="py-3 px-6 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-500 hover:shadow-lg transition duration-300 transform hover:scale-105 text-center"
              >
                New User
              </Link>)}
             {/* {useroradminrole==="user"?<></>:<></>} */}
              {user && (
                <Link
                  to="/registered-events"
                  className="py-3 px-6 bg-yellow-800 text-white rounded-lg shadow-md hover:bg-yellow-700 hover:shadow-lg transition duration-300 transform hover:scale-105 text-center"
                >
                  View Registered Events
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
