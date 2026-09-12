# 🛒 E-Commerce REST API

A comprehensive backend REST API for an e-commerce platform built with **Node.js**, **Express**, and **MongoDB/Mongoose**. Currently features full product management, category organization, subcategories, brands, advanced search capabilities, filtering, and image uploads with automatic optimization.

---

## ✨ Features

- ✅ Complete CRUD operations for Products, Categories, Subcategories, and Brands
- ✅ Hierarchical category structure with nested subcategories
- ✅ Automatic slug generation from names and titles
- ✅ Request validation using Express Validator
- ✅ Image upload and optimization (category/brand images converted to JPEG with Sharp)
- ✅ Local image storage with static file serving
- ✅ Advanced filtering, sorting, field limiting, and pagination
- ✅ Full-text search functionality
- ✅ Centralized error handling with proper HTTP status codes
- ✅ DRY (Don't Repeat Yourself) CRUD handlers to minimize code duplication
- ✅ CORS enabled for frontend integration

> **Note:** `bcrypt` and `jsonwebtoken` packages are installed in preparation for authentication implementation (not yet active).

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express 5** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **Express Validator** | Request validation |
| **Multer** | File upload handling |
| **Sharp** | Image processing |
| **Slugify** | URL-friendly slug generation |
| **Morgan** | HTTP request logging |
| **CORS** | Cross-origin resource sharing |

---

## 📂 Project Structure

```
e-commerce-api/
├── config/                 # Database connection configuration
├── controllers/            # Business logic & CRUD handlers
├── models/                 # Mongoose schemas
├── routes/                 # API endpoint definitions
├── middlewares/            # Authentication, validation, error handling
├── uploads/categories/     # Category images storage
├── utils/                  # Helper functions, validators, seed data
├── app.js                  # Express application setup
├── server.js               # Server entry point
└── package.json            # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (local or cloud)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd e-commerce-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the project root:
   ```env
   PORT=8080
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

The API will be available at `http://localhost:8080`

---

## 📚 API Endpoints

### Base Routes

| Resource | Endpoint |
|---|---|
| Products | `/api/v1/products` |
| Categories | `/api/v1/categories` |
| Subcategories | `/api/v1/subcategories` |
| Category Subcategories | `/api/v1/categories/:categoryId/subcategories` |
| Brands | `/api/v1/brands` |
| Static Files | `/uploads/...` |

### Examples

```http
# Get all products with filtering and pagination
GET /api/v1/products?keyword=phone&sort=-price&fields=title,price,brand&limit=10&page=1

# Get products by category
GET /api/v1/categories/:categoryId/subcategories

# Create a new category (with image)
POST /api/v1/categories
Content-Type: multipart/form-data

# Search and filter
GET /api/v1/products?keyword=laptop&category=electronics&minPrice=500&maxPrice=2000
```

### Query Parameters

| Parameter | Type | Description |
|---|---|---|
| `keyword` | string | Search in product title/description |
| `sort` | string | Sort field (prefix with `-` for descending) |
| `fields` | string | Comma-separated fields to return |
| `limit` | number | Items per page (default: 10) |
| `page` | number | Page number for pagination (default: 1) |

---

## 🖼 Image Upload

When creating or updating a category or brand, include an image file:

```bash
curl -X POST http://localhost:8080/api/v1/categories \
  -F "name=Electronics" \
  -F "description=Electronic devices" \
  -F "image=@path/to/image.jpg"
```

**Supported formats:** JPEG, PNG, GIF, WebP  
**Auto-processing:** Images are converted to JPEG and optimized automatically.

---

## 🗺 Development Roadmap

- [x] Product Management (CRUD)
- [x] Category & Subcategory Management
- [x] Brand Management
- [x] Image Upload & Processing
- [x] Search, Filter & Pagination
- [ ] Product Images (multiple per product)
- [ ] Brand Image Optimization
- [ ] User Authentication & Authorization
- [ ] User Profiles & Addresses
- [ ] Reviews & Ratings
- [ ] Wishlist Functionality
- [ ] Shopping Cart Management
- [ ] Order Processing
- [ ] Payment Integration
- [ ] Admin Dashboard Features
- [ ] API Documentation (Swagger/OpenAPI)
- [ ] Unit & Integration Tests
- [ ] Security Hardening (Rate Limiting, HTTPS, Helmet, etc.)
- [ ] Performance Optimization (Caching, Indexing)
- [ ] Deployment & CI/CD

---

## 🔒 Security Considerations

Currently, the API is in **development mode**. For production deployment:

- ✅ Enable HTTPS/TLS
- ✅ Implement JWT-based authentication
- ✅ Add rate limiting
- ✅ Use helmet.js for security headers
- ✅ Validate and sanitize all inputs
- ✅ Implement proper error messages (avoid leaking system info)
- ✅ Add request logging and monitoring
- ✅ Use environment variables for secrets

---

## 🧪 Testing

Unit and integration tests coming soon. Currently, the API can be tested using:

- **Postman** - API collection available
- **cURL** - Command-line testing
- **Thunder Client** - VS Code extension
- **Insomnia** - REST API testing

---

## 📝 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `8080` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/ecommerce` |
| `JWT_SECRET` | Secret for JWT signing | `your_secret_key_123` |
| `NODE_ENV` | Environment mode | `development` / `production` |

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or connection string is correct
- Check network connectivity if using cloud MongoDB

### Image Upload Issues
- Verify `uploads/` directory exists and has write permissions
- Check file size limits in Multer configuration

### Port Already in Use
```bash
# Find and kill process using port 8080
lsof -i :8080
kill -9 <PID>
```

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👤 Author

**Abdelrahman Ali Elshenawy**  
Backend Developer in progress 🚀

For questions or collaboration, feel free to reach out!

---

## 🙏 Acknowledgments

Built with modern web technologies and best practices in mind. This is an ongoing project with continuous improvements and feature additions.
