// Import dependencies
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const refreshToken = require("./middleware/refreshToken");
const auth = require("./middleware/auth");

require('dotenv').config();

const mongoose = require('mongoose');


// MongoDB connection
mongoose.connect(process.env.DATABASE)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --------------------
// VIEW ENGINE SETUP
// --------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Use EJS layouts
app.use(expressLayouts);
app.set("layout", "./layout"); // This tells Express to use views/layout.ejs as the default layout

// --------------------
// MIDDLEWARE
// --------------------
// Parse form data (optional)
app.use(cookieParser());   
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (CSS, JS, images) from /public
app.use(express.static(path.join(__dirname, "public")));
app.use(refreshToken);

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------------
// ROUTES
// --------------------

const userRoutes = require('./routes/users');
const indexRoutes = require('./routes/home');
const productRoutes = require('./routes/productRoutes');

app.use('/users', userRoutes);
app.use('/', indexRoutes);
app.use('/product', auth,  productRoutes);

// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
