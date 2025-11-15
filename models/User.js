const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  password: String
});

// Prevent model overwrite if it’s already compiled
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
