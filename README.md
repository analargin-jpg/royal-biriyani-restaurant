# 🍛 Royal Biriyani & Fast Food - Full-Stack Application

> **Next.js (App Router) + Node.js + Express.js + MongoDB (Mongoose)**  
> Complete web application with customer ordering, live tracking, bulk catering management, WhatsApp dispatch, and full admin dashboard.

---

## 🌟 Features Overview

### 1. 🍽️ Customer Portal (Next.js)
- **Royal Themed Design**: Signature brand palette (Crimson `#990000` & Gold `#D4AF37`) with smooth responsive UI.
- **Interactive Menu & Filtering**: Browse Biriyani, Fast Food, Starters & Gravy with live availability status and dietary indicators (Veg, Non-Veg, Egg).
- **Cart & Slide-out Checkout**: Add dishes, adjust portions, and choose between **Home Delivery** and **Self Pickup / Takeaway**.
- **Bulk Catering Request System**: Book large wedding & event feasts (50 to 1000+ guests) with instant price quote requests.
- **Live Order Tracking (`/track`)**: Customers can track their order status (`Pending` ➔ `Confirmed` ➔ `In Kitchen` ➔ `Delivered`) by phone number or Order ID.
- **Direct WhatsApp & Phone Triggers**: Direct contact with restaurant kitchen (`+91 74185 25405`) and admin WhatsApp (`6384945599`).

### 2. 👨‍💼 Admin Dashboard (`/admin`)
- **Secure Authentication**: Protected admin portal with JWT token session management (Default: `admin` / `admin123`).
- **Real-Time Analytics**: Summary metric cards for Total Orders, Pending Review, Confirmed, Completed, and Total Guests Served.
- **Order Management Board**: Filter orders by status (`pending`, `confirmed`, `completed`, `cancelled`), search by name/phone/ID.
- **One-Click WhatsApp Automation**:
  - `💬 Send to Customer`: Opens pre-formatted WhatsApp confirmation receipt to customer.
  - `📢 Notify Admin (6384945599)`: Transmits kitchen dispatch alerts directly to admin.
- **Manual Order Creation**: Add phone-in or walk-in customer orders manually.
- **CSV Data Export**: Export orders report to `.csv` spreadsheet with one click.
- **Menu & Dish Catalog Management (`/admin/menu`)**: Add new dishes, edit prices, update descriptions, and toggle "In Stock" / "Sold Out" status in real time.

---

## 📂 Project Architecture

```
RB/
├── backend/                  # Node.js + Express.js + MongoDB REST API Server (Port 5000)
│   ├── config/
│   │   └── db.js             # Mongoose connection with resilient reconnect
│   ├── controllers/
│   │   ├── authController.js # Admin JWT authentication
│   │   ├── menuController.js # Menu catalog CRUD & stock toggles
│   │   └── orderController.js# Order lifecycle, search, stats, tracking
│   ├── models/
│   │   ├── Admin.js          # Admin user schema with bcrypt
│   │   ├── MenuItem.js       # Menu dish schema
│   │   └── Order.js          # Order schema (Bulk & Regular orders)
│   ├── routes/
│   │   ├── authRoutes.js     # /api/auth
│   │   ├── menuRoutes.js     # /api/menu
│   │   └── orderRoutes.js    # /api/orders
│   ├── seed/
│   │   └── seedData.js       # Database seeder (menu dishes & sample orders)
│   ├── .env                  # Backend environment configuration
│   ├── .env.example
│   ├── package.json
│   └── server.js             # Express entry point
│
├── frontend/                 # Next.js 14 (App Router) + Tailwind CSS (Port 3000)
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/
│   │   │   │   ├── page.jsx  # Admin Dashboard
│   │   │   │   └── menu/
│   │   │   │       └── page.jsx # Menu Manager
│   │   │   ├── track/
│   │   │   │   └── page.jsx  # Customer Order Tracker
│   │   │   ├── globals.css   # Royal Theme Tailwind styles
│   │   │   ├── layout.jsx    # Root HTML layout
│   │   │   └── page.jsx      # Customer Landing & Ordering Page
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLoginModal.jsx
│   │   │   ├── BulkOrderForm.jsx
│   │   │   ├── CartDrawer.jsx
│   │   │   ├── ContactSection.jsx
│   │   │   ├── FloatingWhatsApp.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── MenuManager.jsx
│   │   │   ├── MenuSection.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── OrderCard.jsx
│   │   │   ├── OrderTrackingModal.jsx
│   │   │   └── StatCards.jsx
│   │   └── lib/
│   │       └── api.js        # Axios API client
│   ├── next.config.js        # Next.js config with API proxy rewrites
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json              # Root orchestration (concurrently runner)
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (Tested on Node.js v24)
- **npm**: v9+
- **MongoDB**: Local MongoDB server or [MongoDB Atlas Free Cloud Cluster](https://www.mongodb.com/atlas)

---

### Step 1: Install Dependencies
Run the command below from the root project directory:
```bash
npm run install:all
```
*(Or install in root, `backend/`, and `frontend/` separately).*

---

### Step 2: Configure Environment Variables
Verify or adjust `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/royal_biriyani
JWT_SECRET=royal_biriyani_super_secret_jwt_key_2024
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_PHONE=6384945599
RESTAURANT_PHONE=7418525405
CLIENT_URL=http://localhost:3000
```
> **Tip**: If using MongoDB Atlas cloud database, paste your connection string into `MONGODB_URI`.

---

### Step 3: Seed Database (Optional but Recommended)
Populate the database with authentic Royal Biriyani menu dishes and sample orders:
```bash
npm run seed
```

---

### Step 4: Run the Application
Start both the **Express API Backend (Port 5000)** and **Next.js Frontend (Port 3000)** concurrently with a single command:
```bash
npm run dev
```

- **Customer Website**: [http://localhost:3000](http://localhost:3000)
- **Live Order Tracker**: [http://localhost:3000/track](http://localhost:3000/track)
- **Admin Portal**: [http://localhost:3000/admin](http://localhost:3000/admin) *(Username: `admin` | Password: `admin123`)*
- **REST API Health Endpoint**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🛠️ REST API Endpoints Reference

### Orders API (`/api/orders`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/orders` | List orders (supports `?status=`, `?search=`, `?page=`) |
| `GET` | `/api/orders/stats` | Summary statistics (total, pending, confirmed, completed, guests) |
| `GET` | `/api/orders/track/:query` | Track order by Order ID or Customer Phone number |
| `GET` | `/api/orders/:id` | Get single order details |
| `POST` | `/api/orders` | Create bulk or regular customer order |
| `PATCH` | `/api/orders/:id/status` | Update order status (`pending`, `confirmed`, `completed`, `cancelled`) |
| `PUT` | `/api/orders/:id` | Update full order details |
| `DELETE` | `/api/orders/:id` | Delete an order |

### Menu API (`/api/menu`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/menu` | List all menu dishes (with category groupings) |
| `POST` | `/api/menu` | Add new dish to menu |
| `PATCH` | `/api/menu/:id/toggle` | Toggle in-stock / sold-out status |
| `PUT` | `/api/menu/:id` | Edit dish name, price, description, category |
| `DELETE` | `/api/menu/:id` | Remove dish from catalog |

### Auth API (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Admin login with JWT token issuance |
| `GET` | `/api/auth/me` | Verify admin token session |

---

## 📱 WhatsApp Integration Details

- **Customer WhatsApp Confirmation**:
  - Automatically formats the full order ticket with Order ID, customer details, dishes ordered, delivery address, and pricing.
  - Generates direct link to customer's mobile number: `https://wa.me/<customer_phone>?text=...`
- **Kitchen & Admin Alerts**:
  - Prepares kitchen dispatch alert directly to Admin WhatsApp (`6384945599`) and Restaurant (`+91 74185 25405`).

---

## 🚢 Production Deployment

### Frontend (Vercel)
1. Push project to GitHub.
2. In [Vercel](https://vercel.com), import repo and set Root Directory to `frontend`.
3. Add Environment Variable: `NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api`.
4. Deploy!

### Backend (Render / Railway / VPS)
1. Deploy `backend` to [Render.com](https://render.com) or [Railway](https://railway.app).
2. Set Environment Variables (`MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, etc.).
3. Start command: `npm start`.

---

© 2024 Royal Biriyani & Fast Food • Salem Main Rd, Komarapalayam, Tamil Nadu 638183
