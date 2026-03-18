# 🍔 Cravingggg — Food Delivery App

A full-stack food delivery web application built with React.js, Node.js, Express.js, and MongoDB. Similar to Swiggy/Zomato with modern UI.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-20-green) ![MongoDB](https://img.shields.io/badge/MongoDB-8-brightgreen) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-cyan)

## ✨ Features

### User Features
- 🔐 JWT-based Registration & Login
- 🍽️ Browse & Search Restaurants
- 🔍 Filter by cuisine, veg/non-veg, rating
- 📋 View Restaurant Menus
- 🛒 Add to Cart with quantity controls
- 📦 Place Orders with delivery address
- 📜 Order History with status tracking

### Restaurant Features
- ⭐ Ratings & Reviews
- 🏷️ Category-based menu organization
- 📍 Location & delivery information
- 🟢 Veg/Non-veg indicators + Bestseller badges

### Admin Dashboard
- 📊 Stats overview
- ➕ Add/Delete Restaurants
- ➕ Add/Delete Food Items
- 📋 Manage Orders (update status)
- 👥 View all Users

### Cart & Payment
- 🛒 Single-restaurant cart enforcement
- 💰 Price calculation with taxes & delivery fee
- 💵 Cash on Delivery
- 💳 Online Payment (integration ready)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Styling | Tailwind CSS v4, Custom Design System |

## 📁 Project Structure

```
cravingggg/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── middleware/auth.js     # JWT auth middleware
│   ├── models/               # Mongoose models
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   ├── FoodItem.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/               # Express routes
│   │   ├── auth.js
│   │   ├── restaurants.js
│   │   ├── food.js
│   │   ├── cart.js
│   │   └── orders.js
│   ├── seed/seedData.js      # Sample data
│   ├── server.js             # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/index.js      # Axios API layer
│   │   ├── components/       # Reusable components
│   │   ├── context/          # Auth & Cart providers
│   │   ├── pages/            # All page components
│   │   ├── App.jsx           # Main app with routing
│   │   ├── index.css         # Tailwind + Design System
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### 1. Clone the repo
```bash
git clone https://github.com/your-username/cravingggg.git
cd cravingggg
```

### 2. Setup Backend
```bash
cd backend
npm install
```

**Configure environment:** Edit `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cravingggg
JWT_SECRET=your_secret_key_here
```

**Seed the database:**
```bash
npm run seed
```

**Start the backend:**
```bash
npm run dev
```
The API will run at `http://localhost:5000`

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
The app will run at `http://localhost:5173`

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cravingggg.com | admin123 |
| User | john@example.com | password123 |

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update profile |
| GET | `/api/auth/users` | Get all users (admin) |

### Restaurants
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/restaurants` | Get all (with filters) |
| GET | `/api/restaurants/featured` | Get featured |
| GET | `/api/restaurants/:id` | Get by ID |
| POST | `/api/restaurants` | Create (admin) |
| PUT | `/api/restaurants/:id` | Update (admin) |
| DELETE | `/api/restaurants/:id` | Delete (admin) |

### Food Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/food` | Get all (with filters) |
| GET | `/api/food/restaurant/:id` | Get by restaurant |
| POST | `/api/food` | Create (admin) |
| PUT | `/api/food/:id` | Update (admin) |
| DELETE | `/api/food/:id` | Delete (admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart/add` | Add item |
| PUT | `/api/cart/update` | Update quantity |
| DELETE | `/api/cart/clear` | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order |
| GET | `/api/orders/my` | User's orders |
| GET | `/api/orders/:id` | Get by ID |
| GET | `/api/orders` | Get all (admin) |
| PUT | `/api/orders/:id/status` | Update status (admin) |

## 📝 License

MIT License
