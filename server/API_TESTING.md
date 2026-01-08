# API Testing Guide

Quick reference for testing the API endpoints using curl, Postman, or Thunder Client.

## Authentication Endpoints

### 1. Register User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@catalog.com",
  "password": "admin123"
}
```

**Response:** Save the `token` from the response for authenticated requests.

### 3. Get Current User
```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

### 4. Update Profile
```bash
PUT http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

### 5. Update Password
```bash
PUT http://localhost:5000/api/auth/password
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "currentPassword": "admin123",
  "newPassword": "newpassword123"
}
```

## Product Endpoints

### 1. Get All Products
```bash
# Basic request
GET http://localhost:5000/api/products

# With filters
GET http://localhost:5000/api/products?year=2024&month=April&category=Furniture

# With search
GET http://localhost:5000/api/products?search=chair

# With sorting
GET http://localhost:5000/api/products?sortBy=price-high

# With pagination
GET http://localhost:5000/api/products?page=1&limit=10

# Editor's picks only
GET http://localhost:5000/api/products?editorsPick=true

# Best selling only
GET http://localhost:5000/api/products?bestSelling=true
```

### 2. Get Product Timeline
```bash
GET http://localhost:5000/api/products/timeline
```

### 3. Get Single Product
```bash
GET http://localhost:5000/api/products/:productId
```

### 4. Get Related Products
```bash
GET http://localhost:5000/api/products/:productId/related
```

### 5. Create Product (Admin Only)
```bash
POST http://localhost:5000/api/products
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "name": "Premium Office Chair",
  "description": "Ergonomic office chair with lumbar support",
  "price": 599.99,
  "category": "Furniture",
  "sku": "CH-2024-100",
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "alt": "Office Chair"
    }
  ],
  "year": 2024,
  "month": "December",
  "status": "Active",
  "visibility": {
    "published": true,
    "bestSelling": false,
    "editorsPick": true
  },
  "tags": ["furniture", "office", "chair"],
  "stock": 20
}
```

### 6. Update Product (Admin Only)
```bash
PUT http://localhost:5000/api/products/:productId
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "price": 549.99,
  "stock": 15,
  "visibility": {
    "published": true,
    "bestSelling": true,
    "editorsPick": true
  }
}
```

### 7. Delete Product (Admin Only)
```bash
DELETE http://localhost:5000/api/products/:productId
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

### 8. Get Product Statistics (Admin Only)
```bash
GET http://localhost:5000/api/products/stats/summary
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

## User Management (Admin Only)

### 1. Get All Users
```bash
GET http://localhost:5000/api/users
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

### 2. Get User by ID
```bash
GET http://localhost:5000/api/users/:userId
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

### 3. Update User
```bash
PUT http://localhost:5000/api/users/:userId
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "admin",
  "isActive": true
}
```

### 4. Delete User
```bash
DELETE http://localhost:5000/api/users/:userId
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

## More Page Endpoints

### 1. Get All More Pages
```bash
# Get published pages
GET http://localhost:5000/api/more

# Get all pages (including drafts, if admin)
GET http://localhost:5000/api/more?status=DRAFT
```

### 2. Get Page by ID
```bash
GET http://localhost:5000/api/more/:pageId
```

### 3. Get Page by Slug
```bash
GET http://localhost:5000/api/more/slug/our-journey-mission
```

### 4. Create More Page (Admin Only)
```bash
POST http://localhost:5000/api/more
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "title": "About Us",
  "content": "This is our story...",
  "status": "PUBLISHED",
  "order": 1
}
```

### 5. Update More Page (Admin Only)
```bash
PUT http://localhost:5000/api/more/:pageId
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "status": "PUBLISHED"
}
```

### 6. Delete More Page (Admin Only)
```bash
DELETE http://localhost:5000/api/more/:pageId
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

### 7. Reorder Pages (Admin Only)
```bash
PUT http://localhost:5000/api/more/reorder/bulk
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "pages": [
    { "id": "pageId1", "order": 1 },
    { "id": "pageId2", "order": 2 },
    { "id": "pageId3", "order": 3 }
  ]
}
```

## Testing Workflow

### 1. Initial Setup
1. Start MongoDB
2. Seed database: `npm run seed`
3. Start server: `npm run dev`

### 2. Get Admin Token
```bash
POST http://localhost:5000/api/auth/login
{
  "email": "admin@catalog.com",
  "password": "admin123"
}
```
Copy the token from response.

### 3. Test Admin Endpoints
Use the token in Authorization header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### 4. Test Public Endpoints
No authorization needed for:
- GET products
- GET product timeline
- GET single product
- GET more pages
- Login/Register

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10,      // For list endpoints
  "total": 100,     // For paginated endpoints
  "page": 1,        // Current page
  "pages": 10       // Total pages
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [       // For validation errors
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## cURL Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@catalog.com","password":"admin123"}'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Product",
    "description": "Description",
    "price": 99.99,
    "category": "Furniture",
    "sku": "TEST-001",
    "year": 2024,
    "month": "January"
  }'
```
