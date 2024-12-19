const express = require("express");
const connectDB = require("./config/db");
// const eventDb = require('./config/Event');
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const path = require("path");

dotenv.config();

// Create Express server
const app = express();
app.use(cookieParser())
// Connect to the database
connectDB();
// eventDb()
// Middleware
app.use(express.json()); // For parsing JSON requests
const corsOptions = {
  origin: ['http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  credentials: true, 
  preflightContinue: false, 
  allowedHeaders: ['Content-Type', 'Authorization'] 
};


app.use(cors(corsOptions));

app.options('*', cors(corsOptions)); 

app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "routes", "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
app.use("/api/auth", authRoutes); // Authentication routes (Login/Signup)

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
