import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateEvent from './pages/EventForm';
import EventDetails from './pages/EventDetails';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import SignupForm from './pages/SignupForm';
import LoginForm from './pages/LoginForm';
import DisplayEvent from './pages/DisplayEvent';
import Enquiry from './pages/Enquiry';
import RegisteredEvents from './pages/RegisterdEvents';
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:5000"; 
function App() {
  return (
 
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upcomingevents" element={<DisplayEvent />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/event/:id" element={<EventDetails />} />           
          <Route path="/signup" element={<SignupForm />} />           
          <Route path="/login" element={<LoginForm />} />           
          <Route path="/enquiry" element={<Enquiry />} />           
          <Route path="/registered-events" element={<RegisteredEvents />} />           
           </Routes>
      </Router>
  );
}

export default App;
