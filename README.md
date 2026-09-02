# 🛒 E-Commerce REST API

A backend REST API for an E-Commerce application built with **Node.js, Express, and MongoDB/Mongoose**. The project focuses on clean backend structure, reusable CRUD handlers, API features, validation, error handling, and image uploads.

## 🚀 Tech Stack

- **Node.js**
- **Express.js 5**
- **MongoDB / Mongoose**
- **JWT** – Authentication foundation
- **bcrypt** – Password hashing
- **Express Validator** – Request validation
- **Multer** – Image/file uploads
- **UUID** – Unique file names
- **Slugify** – URL-friendly slugs
- **Morgan** – HTTP request logging
- **CORS**
- **Dotenv** – Environment variables
- **Nodemon** – Development server

## 📁 Project Structure

```text
E-commerce-Project/
│
├── .config/
│   └── DataBaseConnection.cjs
│
├── Controllers/
│   ├── BrandController.cjs
│   ├── CategoryController.cjs
│   ├── FactoyHandlers.cjs
│   ├── ProductController.cjs
│   └── SubCategoryConstroller.cjs
│
├── Models/
│   ├── BrandSchema.cjs
│   ├── CategorySchema.cjs
│   ├── ProductSchema.cjs
│   └── SubCategorySchema.cjs
│
├── Routers/
│   ├── BrandRouter.cjs
│   ├── CategoryRouter.cjs
│   ├── ProductRouter.cjs
│   └── SubCategoryRouter.cjs
│
├── middlewares/
│   ├── ErrorMiddleware.cjs
│   └── validatorMiddleware.cjs
│
├── utils/
│   ├── ApiError.cjs
│   ├── ApiFeatures.cjs
│   └── dummyData/
│       ├── products.json
│       └── seeder.js
│
├── app.js
├── package.json
└── .env
```

## ✨ Current Features

### Product Management
- Create products
- Get all products
- Get a single product
- Update products
- Delete products

### Category Management
- CRUD operations for categories
- Category image upload using Multer
- Unique image names using UUID
- Category slug support

### Subcategory Management
- CRUD operations for subcategories
- Categories/subcategories relationship
- `mergeParams` support for nested routes

### Brand Management
- CRUD operations for brands
- Validation middleware

### API Features
The project includes a reusable `ApiFeatures` class that supports:

- Filtering
- Sorting
- Field limiting
- Searching
- Pagination

Example:

```http
GET /api/products?sort=price&fields=name,price&limit=10&page=1
```

## 🧩 Reusable Factory Handlers

The project uses reusable CRUD handlers to reduce duplicated controller code.

Examples:

```js
CreateOne(Model)
GetOne(Model)
GetAll(Model)
UpdateOne(Model)
DeleteOne(Model)
```

This allows different resources to share common CRUD logic while keeping their controllers smaller and easier to maintain.

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

> Never commit your real `.env` file or secrets to GitHub.

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/Abdelrahman-Ali769/E-commerce-Project.git
```

Move into the project directory:

```bash
cd E-commerce-Project
```

Install dependencies:

```bash
npm install
```

Create your `.env` file and add the required environment variables.

Start the development server:

```bash
npm start
```

The API will run on:

```text
http://localhost:8080
```

## 🔗 Main API Routes

| Resource | Base Route |
|---|---|
| Products | `/api/products` |
| Categories | `/api/categories` |
| Subcategories | `/api/categories/:categoryId/subcategories` |
| Brands | `/api/brands` |

> Route names can be adjusted according to the router configuration in the project.

## 🛡️ Error Handling

The application includes centralized error handling using:

- Custom `ApiError` class
- Global error middleware
- `404` route handling
- `uncaughtException` handling
- `unhandledRejection` handling

This keeps error responses consistent and makes debugging easier.

## 📤 Image Uploads

Category images are handled with **Multer** and stored locally during development.

The upload flow includes:

1. Receive the uploaded image.
2. Validate the file type.
3. Generate a unique file name using UUID.
4. Store the image in the categories upload directory.

## 🗺️ Roadmap

The project is still under development. Planned improvements include:

- [ ] User model
- [ ] Register / Login
- [ ] JWT authentication
- [ ] Authorization and roles
- [ ] Cart
- [ ] Wishlist
- [ ] Orders and order items
- [ ] Product reviews and ratings
- [ ] Payment integration
- [ ] Email service
- [ ] Swagger / OpenAPI documentation
- [ ] Unit and integration testing
- [ ] Cloud image storage
- [ ] Deployment
- [ ] TypeScript migration

## 🎯 Project Goal

The main goal of this project is to build a scalable and maintainable E-Commerce backend while practicing real-world backend concepts such as:

- RESTful API design
- MVC architecture
- Database relationships
- Middleware
- Validation
- Authentication and authorization
- Error handling
- File uploads
- Reusable backend abstractions
- API filtering, searching, sorting, and pagination

## 👨‍💻 Author

**Abdelrahman Ali Elshenawy**

Backend Developer in progress 🚀

---

⭐ If you find this project useful, feel free to star the repository.
