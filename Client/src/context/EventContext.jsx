import React, { createContext, useContext, useState } from "react";

// Create the context
const EventContext = createContext();

// EventProvider component to wrap the app and provide context to components
export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([
    { id: 1, name: "Music Concert", date: "2024-12-20", description: "Enjoy a night of classical and modern music." },
    { id: 2, name: "Art Exhibition", date: "2024-12-22", description: "Explore the finest artworks from upcoming artists." },
    { id: 3, name: "Tech Conference", date: "2024-12-24", description: "Learn about the latest in technology and innovation." },
    { id: 4, name: "Food Festival", date: "2024-12-25", description: "Taste delicious cuisines from around the world." },
    { id: 5, name: "Marathon", date: "2024-12-27", description: "Participate in our annual city marathon." },
    { id: 6, name: "Book Fair", date: "2024-12-29", description: "Discover and buy books from diverse genres." },
    { id: 7, name: "Dance Competition", date: "2024-12-30", description: "Watch amazing performances by talented dancers." },
    { id: 8, name: "Startup Pitch", date: "2024-12-31", description: "Cheer for innovative startups pitching their ideas." },
    { id: 9, name: "Hackathon", date: "2024-12-19", description: "Collaborate to solve problems in a 24-hour coding event." },
    { id: 10, name: "Charity Run", date: "2024-12-21", description: "Run to support local charities and causes." },
    { id: 11, name: "Photography Workshop", date: "2024-12-23", description: "Enhance your photography skills with experts." },
    { id: 12, name: "Film Screening", date: "2024-12-28", description: "Watch award-winning films and discuss with directors." },
    { id: 13, name: "Yoga Retreat", date: "2024-12-26", description: "Relax and rejuvenate with our guided yoga sessions." },
    { id: 14, name: "Science Fair", date: "2024-12-18", description: "Explore exciting science projects and demonstrations." },
    { id: 15, name: "Career Workshop", date: "2024-12-17", description: "Build your career with expert advice and guidance." },
    { id: 16, name: "Comedy Night", date: "2024-12-16", description: "Laugh your heart out with top comedians." },
    { id: 17, name: "Cooking Class", date: "2024-12-15", description: "Learn to cook delicious meals from top chefs." },
    { id: 18, name: "Live Theatre", date: "2024-12-14", description: "Experience drama and storytelling at its finest." },
    { id: 19, name: "Gaming Tournament", date: "2024-12-13", description: "Compete in popular video games with cash prizes." },
    { id: 20, name: "Cultural Parade", date: "2024-12-12", description: "Celebrate diversity with a vibrant cultural parade." }
  ]);

  const getEventById = (id) => {
    return events.find(event => event.id === parseInt(id));
  };

  return (
    <EventContext.Provider value={{ events, getEventById }}>
      {children}
    </EventContext.Provider>
  );
};

// Custom hook to use the context
export const useEvents = () => {
  return useContext(EventContext);
};
