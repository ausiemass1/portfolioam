# 🛒 E-Commerce Web Application (Node.js + Express)

A full-stack e-commerce web application built with **Node.js, Express, MongoDB, and EJS**, featuring secure authentication, an admin dashboard, product management, cloud image storage, and modern payment integrations.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- Email & password authentication
- OAuth login with **Google** and **GitHub**
- Secure session management
- Role-based access control (Admin / User)
- Protected admin routes (middleware enforced)

---

### 🧑‍💼 Admin Dashboard
- Dedicated admin layout and routes
- Admin-only access control
- Manage products, categories, and sizes
- View and manage orders
- Secure CRUD operations

---

### 📦 Product Management
- Full **CRUD functionality** for products
- Product fields:
  - Name
  - Description
  - Price
  - Category
  - Sizes
  - Multiple images
- Category and size relationships (MongoDB references)
- Admin-only product creation and updates

---

### 🖼️ Image Uploads (AWS S3)
- Product images stored securely in **AWS S3**
- Multer for multipart form handling
- Unique file naming for uploads
- Supports **multiple images per product**
- Public S3 URLs stored in MongoDB

---

### 💳 Payments
- **Stripe Checkout** integration
- **PayPal** payment support
- Secure server-side payment handling
- **Webhooks** for:
  - Payment confirmation
  - Order status updates
- Protection against duplicate transactions

---

### 🧱 Tech Stack

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose

**Frontend**
- EJS (Server-side rendering)
- Materialize CSS

**Authentication**
- Passport.js
- Google OAuth 2.0
- GitHub OAuth
- Local email/password strategy

**Cloud & Payments**
- AWS S3 (image storage)
- Stripe (payments + webhooks)
- PayPal

---


---

## 🔒 Route Protection

- Authentication middleware ensures only logged-in users can access protected routes
- Admin middleware restricts admin routes
- Unauthorized access is redirected or blocked

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=3000
MONGO_URI=your_mongodb_uri

SESSION_SECRET=your_session_secret

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# AWS S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=your_region
AWS_S3_BUCKET=your_bucket_name

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret


## Getting Started
Install dependencies
npm install

Run the application
npm run dev


or

npm start

🧪 Future Improvements

Order history for users

Inventory tracking per size

Product reviews and ratings

Email notifications

Admin analytics dashboard

📄 License

This project is licensed under the MIT License.

👨Author
Built by Austin Masamhiri
Full-Stack Web Developer

