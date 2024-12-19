import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [useroradminrole, setuseroradminrole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username,setUsername] = useState(null)
  const [message,setMessage] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        
        const { data } = await axios.get("http://localhost:5000/api/auth/profile", {
          withCredentials: true, 
        });
        const username = data?.user?.split('@')[0]
        console.log(data);
        setUsername(username)
        setMessage(data.message)

  
        if (data.id) {
          setUser(data.user);
          setuseroradminrole(data.role);
          setUserId(data.id); 
        } else {
          const username = data?.user?.split('@')[0]
          setUser(data.user);
          setuseroradminrole(data.role);
          setUsername(username)
        }
      } catch (error) {
        console.log("User not authenticated:", error);
        setUser(null);
        setuseroradminrole(null);
        setUserId(null); 
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, useroradminrole, setuseroradminrole, userId ,username,message }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
