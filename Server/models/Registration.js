const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['registered', 'cancelled'], default: 'registered' },
}, { timestamps: true });

const Registration = mongoose.model('Registration', RegistrationSchema);
module.exports = Registration;
