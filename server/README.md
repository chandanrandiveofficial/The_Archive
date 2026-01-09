# Product Catalog Backend API

A comprehensive REST API for managing a product catalog with user authentication, product management, and content management features.

## Features

- **Authentication & Authorization**
  - User registration and login with JWT
  - Role-based access control (Admin/User)
  - Password encryption with bcrypt
  - Protected routes

- **Product Management**
  - CRUD operations for products
  - Advanced filtering (year, month, category, status)
  - Search functionality
  - Timeline-based organization
  - Product statistics
  - Related products

- **User Management**
  - User profile management
  - Password updates
  - Admin user management

- **Content Management**
  - "More Page" content management
  - Draft/Published status
  - Content ordering

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Express Validator
- **Security:** Helmet, CORS, bcryptjs

## Installation

1. **Clone the repository**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `PORT` - Server port (default: 5000)
   - `MONGO_URI` - MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT tokens
   - `JWT_EXPIRE` - Token expiration time
   - `CORS_ORIGIN` - Frontend URL for CORS

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Run the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login user |
| GET | `/me` | Private | Get current user |
| PUT | `/profile` | Private | Update user profile |
| PUT | `/password` | Private | Update password |

### Products (`/api/products`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all products (with filters) |
| GET | `/timeline` | Public | Get products grouped by year/month |
| GET | `/:id` | Public | Get single product |
| GET | `/:id/related` | Public | Get related products |
| POST | `/` | Admin | Create new product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Delete product |
| GET | `/stats/summary` | Admin | Get product statistics |

### Users (`/api/users`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Admin | Get all users |
| GET | `/:id` | Admin | Get user by ID |
| PUT | `/:id` | Admin | Update user |
| DELETE | `/:id` | Admin | Delete user |

### More Pages (`/api/more`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all more pages |
| GET | `/:id` | Public | Get page by ID |
| GET | `/slug/:slug` | Public | Get page by slug |
| POST | `/` | Admin | Create new page |
| PUT | `/:id` | Admin | Update page |
| DELETE | `/:id` | Admin | Delete page |
| PUT | `/reorder/bulk` | Admin | Reorder pages |

## Query Parameters

### Products API

```bash
# Filter by year and month
GET /api/products?year=2024&month=April

# Filter by category
GET /api/products?category=Furniture

# Search products
GET /api/products?search=chair

# Sort products
GET /api/products?sortBy=newest
# Options: newest, oldest, price-high, price-low, name

# Pagination
GET /api/products?page=1&limit=20

# Filter by visibility
GET /api/products?bestSelling=true&editorsPick=true
```

## Authentication

Include JWT token in request headers:

```bash
Authorization: Bearer <your_jwt_token>
```

### Example Login Request

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Example Response

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Product Model Schema

```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String, // Furniture, Accessories, Arts, Apps, Lighting, Decor
  sku: String,
  images: [{
    url: String,
    alt: String
  }],
  year: Number,
  month: String,
  status: String, // Active, Hidden, Archived
  visibility: {
    published: Boolean,
    bestSelling: Boolean,
    editorsPick: Boolean,
    bestSellers: Boolean
  },
  tags: [String],
  stock: Number,
  views: Number
}
```

## Error Handling

API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Development

### Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Auth & user controllers
│   │   ├── productController.js  # Product controllers
│   │   └── morePageController.js # More page controllers
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT & role verification
│   │   ├── errorMiddleware.js    # Error handling
│   │   └── validationMiddleware.js # Request validation
│   ├── models/
│   │   ├── User.js               # User model
│   │   ├── Product.js            # Product model
│   │   └── MorePage.js           # More page model
│   ├── routes/
│   │   ├── authRoutes.js         # Auth routes
│   │   ├── userRoutes.js         # User routes
│   │   ├── productRoutes.js      # Product routes
│   │   └── morePageRoutes.js     # More page routes
│   ├── app.js                    # Express app setup
│   └── server.js                 # Server entry point
├── .env.example                  # Environment variables template
└── package.json                  # Dependencies
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Helmet for security headers
- CORS configuration
- Input validation and sanitization
- Role-based access control

## License

ISC
