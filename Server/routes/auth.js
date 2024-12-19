const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Registration = require("../models/Registration");
const path = require("path");
const multer = require("multer");
require("dotenv").config();
const nodemailer = require("nodemailer");
const Event = require("../models/Event");
const router = express.Router();
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const transporter = nodemailer.createTransport({
  service: "Gmail", 
  auth: {
    user: "muthurajfrnd089346@gmail.com", // Your email address
    pass: "jxrd edug xoue meux", // Your email password or app-specific password
  },
});
const uploadsDir = path.join(__dirname, "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

router.post("/upload-photos", upload.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  console.log(req.files);

  req.files.forEach((file) => {
    const { path: tempPath, originalname } = file;
    const ext = path.extname(originalname);
    const newFileName = path.basename(tempPath) + ext;

    const newPath = path.join(uploadsDir, newFileName);

    try {
      fs.renameSync(tempPath, newPath);
      uploadedFiles.push(`/uploads/${newFileName}`);
    } catch (error) {
      console.error(`Error renaming file ${tempPath} to ${newPath}:`, error);
    }
  });
  res.json(uploadedFiles);
});

router.post("/events", async (req, res) => {
  const {
    name,
    date,
    description,
    photos,
    location,
    startTime,
    endTime,
    category,
  } = req.body;

  const newEvent = new Event({
    name,
    date,
    description,
    photos,
    location,
    startTime,
    endTime,
    category,
  });

  try {
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: "Failed to add event" });
  }
});

// Get event by ID
router.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event); // Send the event as JSON response
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch event", error: err });
  }
});

router.get("/events", async (req, res) => {
  try {
    const events = await Event.find();

    res.status(200).json(events); // Send the events as JSON response
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events", error: err });
  }
});

router.get("/profile", async (req, res) => {
  const token = req.cookies?.token;
  console.log("token "+token);
  if (!token) return res.json({ message: "Signup or Login to View Upcoming Events" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("get profile "+decoded.id);
    // Verify token
    // const user = await User.findById(decoded.id)
    // console.log(user);
    // Fetch user without password
    if (!decoded) return res.status(404).json({ message: "User not found" });

    res.json({ user: decoded.email, role: decoded.role, id: decoded.id }); // Send user info
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

router.put("/events/:id", upload.array("photos", 100), async (req, res) => {
  // console.log("Received files:", req.files);
  console.log("Received photos:", req.body.photos);

  try {
    const { name, date, description, photos, location, startTime, endTime, category } = req.body;
    console.log(req.body.photos);
    
    // Combine existing photos and newly uploaded ones
    // const allPhotos = [...photosArray, ...uploadedFiles];
    // console.log("All photos:", allPhotos);

    const existingEvent = await Event.findById(req.params.id);
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    existingEvent.name = name || existingEvent.name;
    existingEvent.date = date || existingEvent.date;
    existingEvent.description = description || existingEvent.description;
    existingEvent.photos = photos;
    existingEvent.location = location || existingEvent.location;
    existingEvent.startTime = startTime || existingEvent.startTime;
    existingEvent.endTime = endTime || existingEvent.endTime;
    existingEvent.category = category || existingEvent.category;

    const updatedEvent = await existingEvent.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Failed to update event", error });
  }
});


router.delete("/events/:id", async (req, res) => {
  // console.log(req.params.id);

  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    // console.log(event);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete event", error: err });
  }
});
router.post("/adminlogin", async (req, res) => {
  const { email, password } = req.body;
  const role = "admin";
  try {
    // Check if email matches the hardcoded admin email
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password matches the hardcoded admin password
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: email, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Set token expiration (1 hour)
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // Only over HTTPS
        sameSite: "none", // Allow cross-origin
        maxAge: 3600000, 
      })
      .json({
        user: email,
        role: role,
        success: true,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/userregister", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password asynchronously
    const hashedPassword = await bcrypt.hash(password, 10); // Using 10 as the salt rounds

    // Create the new user
    const createdUser = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    // Create JWT token
    const token = jwt.sign(
      { id: createdUser._id, email: createdUser.email, role: createdUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Set token expiration (1 hour)
    );

    // Respond with the created user and token
    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  // Clear the token cookie by setting it to an empty string with an expired date
  res.cookie("token", "", { expires: new Date(0), httpOnly: true });

  // Send response to the client
  res.status(200).json({ message: "Logged out successfully" });
});
// Login
router.post("/userlogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ email });

    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use the async version of bcrypt.compare
    const isPasswordValid = await bcrypt.compare(password, userDoc.password);

    if (isPasswordValid) {
      const token = jwt.sign(
        {
          email: userDoc.email,
          role: userDoc.role,
          id: userDoc._id,
          // name: userDoc.name (uncomment if you want to include the name)
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Set cookie with secure options
      res
        .cookie("token", token, {
          httpOnly: false, 
    secure: true,    // Only sent over HTTPS
    sameSite: "none", // Optional: Cookie expiration time (1 hour)
        })
        .json({
          user: userDoc.email,
          role: userDoc.role,
          id: userDoc.id,
          success: true,
        });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/enquiry", async (req, res) => {
  try {
    const { name, email, enquiry } = req.body;

    // Set up the mail options
    const mailOptions = {
      from: email, // sender address
      to: "muthurajfrnd089346@gmail.com", // replace with your receiver email
      subject: `New Enquiry from ${name}`, // subject
      text: `You have received a new enquiry:\n\nName: ${name}\nEmail: ${email}\nEnquiry: ${enquiry}`, // text body
    };

    // Send email using Nodemailer
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);
    return res.json({
      success: true,
      message: "Enquiry submitted and email sent successfully",
    });
  } catch (error) {
    console.error("Error in sending enquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send enquiry",
      error: error.message,
    });
  }
});

router.post("/register-event", async (req, res) => {
  const { eventId } = req.body;
 const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
     const userId = decoded.id;
     console.log("userid for registering eevnts "+userId);
     const existingRegistration = await Registration.findOne({ eventId, userId });
     if (existingRegistration) {
      return res.status(200).json({ message: "Already registered for this event." });
    }
    const newRegistration = new Registration({ eventId, userId });
    await newRegistration.save();

    res.status(200).json({ message: "Registration successful." });
    // res.json({ user: decoded.email, role: decoded.role, id: decoded.id });
  } catch (error) {
    console.error("Error registering event:", error);
    res.status(500).send("Error registering event");
  }
});

router.get("/registered-events", async (req, res) => {
  const token = req.cookies.token; // Get token from cookies
  
  if (!token) {
    return res.status(401).json({ error: "No token provided, authorization denied" });
  }

  // Verify the token and extract userId
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    const userId = decoded.id; // Extract userId from decoded token
    // console.log("decoded"+userId);
    
    try {
      // Find all registrations for the specific user
      const registrations = await Registration.find({ userId })
        .populate("eventId") // Populate the event details based on eventId
        .exec(); // Execute the query
       console.log(registrations);
       
      // If no registrations found for the user
      if (registrations.length === 0) {
        return res.status(200).json({ message: "No registered events found for this user" });
      }

      // Extract event data from populated registrations
      // const events = registrations.map((registration) => registration.eventId);
      // console.log(events);
      
      res.status(200).json(registrations); // Send back the event data
    } catch (error) {
      console.error("Error fetching registered events:", error);
      res.status(500).json({ error: "Error fetching registered events" });
    }
  });
});

module.exports = router;
