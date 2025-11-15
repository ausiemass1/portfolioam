const User = require('../models/User');

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

//const User = require('../models/User'); // adjust path if needed

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

