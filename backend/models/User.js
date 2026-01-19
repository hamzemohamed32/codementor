const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true }, // Sparse allows multiple nulls
  email: { type: String, required: true, unique: true },
  password: { type: String }, // For email/password auth
  name: { type: String },
  photo: { type: String },
  role: { type: String, default: 'user' },
  plan: { type: String, default: 'free' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
