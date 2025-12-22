import User from '../../models/User.js';
import bcrypt from 'bcrypt';

// Display all users
const getUsers = async (req, res) => {
  const users = await User.find();
  res.render('admin/users/users', { title: 'User List', users, layout: 'admin/layout', });
};

// Seed database wit users for testing
const seedUsers = async (req, res) => {
  await User.insertMany([
    { name: 'Alice', age: 25, email: 'alice@example.com' },
    { name: 'Bob', age: 30, email: 'bob@example.com' },
    { name: 'Charlie', age: 22, email: 'charlie@example.com' }
  ]);
  res.send('✅ Sample users added!');
};

// Handle registration form submission
const registerUser = async (req, res) => {
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

// delete user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;  // Get the user ID from the URL
    await User.findByIdAndDelete(userId); // Delete the user from the DB

    res.redirect('/admin/users'); // After deleting, go back to the user list page
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting user');
  }
};

// Show the edit form
const editUserForm = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render('admin/users/updateUser', { title: "Edit User", user, layout: 'admin/layout', });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading edit form");
  }
};

//Update the form
const updateUser = async (req, res) => {
  try {
    const id = req.params.id;

    await User.findByIdAndUpdate(id, {
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password
    });

    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    res.status(500).send("Update failed");
  }
};

//logout
const logoutUser = (req, res) => {
  // Clear the token cookie
  res.clearCookie("token");

  // Optionally you can add a message or redirect
  res.redirect("/login");  // send user back to login page
};


export default {
  getUsers,
  seedUsers,
  registerUser,
  deleteUser,
  editUserForm,
  updateUser,
  logoutUser,
}




