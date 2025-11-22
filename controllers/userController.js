const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

// Display all users
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.render('pages/users', { title: 'User List', users });
};

// Seed database
exports.seedUsers = async (req, res) => {
  await User.insertMany([
    { name: 'Alice', age: 25, email: 'alice@example.com' },
    { name: 'Bob', age: 30, email: 'bob@example.com' },
    { name: 'Charlie', age: 22, email: 'charlie@example.com' }
  ]);
  res.send('✅ Sample users added!');
};

// Handle registration form submission
exports.registerUser = async (req, res) => {
    try {
        const { name, age, email, password } = req.body;

            // Checking if email already exists
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                // Using flash messages (recommended)
                req.flash("error", "Email already exists. Try another email.");
                return res.redirect('../register');
            }

           // Hash password
           const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user document
        const newUser = new User({
            name,
            age,
            email,
            password: hashedPassword
        });

        await newUser.save();

        //res.send("User registered successfully!");
        res.redirect('../login');
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

// Handle login users
exports.loginUser = async (req, res) => {
  try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).send("Invalid email or password");
      }

      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).send("Invalid email or password");
      }

      // Create JWT token
    const token = jwt.sign(
      { id: user._id },   // payload
      "MYSECRET",         // secret key
      { expiresIn: "1d" } // token duration
    );

    // Store token in cookie
    res.cookie("token", token, { httpOnly: true,
      maxAge: 2 * 60 * 1000,  }); // automatic logout after 2 minutes

      // res.send("Login successful!");
      res.redirect('/users');
  } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;  // Get the user ID from the URL
    await User.findByIdAndDelete(userId); // Delete the user from the DB

    res.redirect('/users'); // After deleting, go back to the user list page
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting user');
  }
};

// Show the edit form
exports.editUserForm = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render('pages/updateUser', { title: "Edit User", user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading edit form");
  }
};

//Update the form
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;

    await User.findByIdAndUpdate(id, {
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
      password: req.body.password
    });

    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.status(500).send("Update failed");
  }
};

//logout
exports.logoutUser = (req, res) => {
  // Clear the token cookie
  res.clearCookie("token");

  // Optionally you can add a message or redirect
  res.redirect("/login");  // send user back to login page
};





