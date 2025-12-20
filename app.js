import "./config/env.js";

// Core dependencies
import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import refreshToken from "./middleware/refreshToken.js";
import passport from "./config/passport.js";
import userRoutes from "./routes/admin/users.routes.js";
import siteRoutes from "./routes/site/site.routes.js";
import authRoutes from "./routes/auth/authRoutes.js";
import adminRoutes from "./routes/admin/admin.routes.js";
import paypalRoutes from "./routes/payments/paypalRoutes.js";
import paymentRoutes from "./routes/payments/stripeRoutes.js";
import stripeCheckout from "./routes/payments/stripeRoutes.js";
import connectDB from "./config/db.js";
import RedisStore from "connect-redis";
import redisClient from "./config/redis.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);

app.use(flash());

// Make flash messages available in all EJS files
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// MongoDB connection
connectDB(); // this runs the code tha is in the config/db.js

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

// Serve static files (CSS, JS, images) from /public
app.use(express.static(path.join(__dirname, "public")));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(passport.initialize()); // initialise the process of login in
app.use(passport.session()); // use session

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use(refreshToken);

// --------------------
// ROUTES
// --------------------
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/", siteRoutes);
app.use("/paypal", paypalRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/stripe", stripeCheckout);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
