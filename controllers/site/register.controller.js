import User from '../../models/User.js';
import bcrypt from 'bcrypt';

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
// register page
const getRegisterForm = (req, res) => {
    res.render("pages/register", { title: "register" });
  };

  export default{
 registerUser,
 getRegisterForm,
  }