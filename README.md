# Product Catalog - MERN Application

A full-stack product catalog and e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js).

## 🏗️ Project Structure

```
The_Archive-main/
├── frontend/          # React + Vite frontend application
│   ├── src/
│   │   ├── admin/    # Admin dashboard pages & components
│   │   ├── client/   # Customer-facing pages & components
│   │   └── components/ # Shared UI components
│   └── ...
├── server/           # Node.js + Express backend API
│   ├── src/
│   │   ├── models/      # MongoDB/Mongoose models
│   │   ├── controllers/ # Route controllers
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth & validation middleware
│   │   └── config/      # Database configuration
│   └── ...
└── README.md
```

## ✨ Features

### Frontend
- **Client Area**
  - Product browsing and search
  - Timeline-based product organization (by year/month)
  - Category filtering
  - Product details page
  - Editor's picks and popular products
  - Responsive design with Tailwind CSS

- **Admin Dashboard**
  - Product management (CRUD operations)
  - User management
  - Content management ("More" pages)
  - Product statistics and analytics
  - Image upload and management

### Backend API
- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin/User)
  - Password encryption with bcrypt
  - Protected routes

- **Product Management**
  - Full CRUD operations
  - Advanced filtering and search
  - Timeline organization
  - Product statistics
  - Related products

- **User Management**
  - User registration and login
  - Profile management
  - Admin user management

- **Content Management**
  - Dynamic "More" page content
  - Draft/Published workflow
  - Content ordering

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or Atlas connection)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd The_Archive-main
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Configure Environment Variables**
   
   Create a `.env` file in the `server` directory:
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/product-catalog
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRE=30d
   CORS_ORIGIN=http://localhost:5173
   ```

5. **Seed the Database (Optional)**
   
   Populate the database with sample data:
   ```bash
   cd server
   npm run seed
   ```
   
   This will create:
   - Admin user: `admin@catalog.com` / `admin123`
   - Regular user: `user@catalog.com` / `user123`
   - Sample products
   - Sample content pages

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on http://localhost:5000

3. **Start the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on http://localhost:5173

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)
- `PUT /api/auth/password` - Update password (Protected)

### Products (`/api/products`)
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/timeline` - Get products by timeline
- `GET /api/products/:id` - Get single product
- `GET /api/products/:id/related` - Get related products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/products/stats/summary` - Get statistics (Admin)

### Users (`/api/users`) - Admin Only
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### More Pages (`/api/more`)
- `GET /api/more` - Get all pages
- `GET /api/more/:id` - Get page by ID
- `GET /api/more/slug/:slug` - Get page by slug
- `POST /api/more` - Create page (Admin)
- `PUT /api/more/:id` - Update page (Admin)
- `DELETE /api/more/:id` - Delete page (Admin)

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router v7** - Routing
- **Tailwind CSS** - Styling
- **Radix UI** - Component primitives
- **Axios** - HTTP client
- **React Query** - Data fetching
- **Formik + Yup** - Form handling
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP logging

## 📁 Project Details

### Database Models

**User Model**
- name, email, password
- role (user/admin)
- isActive status
- avatar
- timestamps

**Product Model**
- name, description, price
- category, SKU
- images array
- year, month (timeline)
- status (Active/Hidden/Archived)
- visibility flags
- tags, stock, views
- timestamps

**MorePage Model**
- title, content
- status (DRAFT/PUBLISHED/ARCHIVED)
- order, slug
- updatedBy reference
- timestamps

### Admin Credentials (After Seeding)
- **Email:** admin@catalog.com
- **Password:** admin123

### User Credentials (After Seeding)
- **Email:** user@catalog.com
- **Password:** user123

## 🔒 Security Features
- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Security headers with Helmet
- CORS configuration

## 📝 Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

## 🤝 Contributing
Feel free to submit issues and pull requests.

## 📄 License
ISC
