const User = require('../models/User');
const bcrypt = require('bcrypt')

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

        res.send("User registered successfully!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

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

      res.send("Login successful!");
  } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
  }
};


