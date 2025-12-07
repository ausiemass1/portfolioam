const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  password: String,
  googleId: String,  
  githubId: String,

  // Add role field
  role: {
    type: String,
    enum: ["user", "admin"],   // allowed roles
    default: "user"            // default role when registering
  }


});



// Prevent model overwrite if it’s already compiled
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
