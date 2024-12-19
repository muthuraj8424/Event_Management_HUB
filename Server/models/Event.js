const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  photos: [String],
  location: { type: String, required: true }, // New field
  startTime: { type: String, required: true }, // New field
  endTime: { type: String, required: true }, // New field
  category: { type: String, required: true }, // New field
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // New field

});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
