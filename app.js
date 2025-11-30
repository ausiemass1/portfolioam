require('dotenv').config();
// Import dependencies
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const cookieParser = require("cookie-parser");
const refreshToken = require("./middleware/refreshToken");
const auth = require("./middleware/auth");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const userRoutes = require('./routes/users');
const indexRoutes = require('./routes/home');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const { profile } = require("console");

const app = express();

app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

// Make flash messages available in all EJS files
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


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


// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(passport.initialize()); // initialise the process of login in
app.use(passport.session()); // use session


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENTID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACKURL
},(accessToken, refreshToken, profile, done) => {
  return done(null, profile)
}
));
passport.serializeUser((user, done)=>done(null, user));
passport.deserializeUser((user, done) => done(null, user));
app.use('/auth', authRoutes);

app.use(refreshToken);

// --------------------
// ROUTES
// --------------------



app.use('/users', userRoutes);
app.use('/', indexRoutes);
app.use('/products', auth,  productRoutes);


// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
