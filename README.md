# E-Commerce REST API

[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Authentication](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

A RESTful backend for managing an e-commerce product catalogue and user accounts. The API provides public product discovery, protected catalogue administration, JWT-based authentication, role-based authorization, account self-service, password recovery by email, and image upload processing.

The application is built as an API service: clients such as a web storefront, mobile app, or admin dashboard can consume its JSON endpoints.

## Table of Contents

- [Highlights](#highlights)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication and Authorization](#authentication-and-authorization)
- [API Reference](#api-reference)
- [Images](#images)
- [Data Model](#data-model)
- [Querying Collections](#querying-collections)
- [Validation and Errors](#validation-and-errors)
- [Examples](#examples)
- [Project Structure](#project-structure)

## Highlights

- JWT registration and login, protected-route middleware, and role-based access control (RBAC).
- Three roles: `user`, `manager`, and `admin`.
- Account self-service: read/update the signed-in profile, change password, and deactivate the current account.
- Email-based password recovery with a cryptographically generated, SHA-256-hashed six-digit code that expires after 10 minutes.
- Inactive accounts cannot use protected routes.
- CRUD APIs for categories, nested subcategories, brands, products, and users.
- Reusable CRUD handlers, request validation, centralized errors, filtering, sorting, field selection, keyword search, and pagination.
- Multer in-memory uploads and Sharp conversion/resizing for category, brand, user, and product images.

## How It Works

Requests enter through `app.js`, which loads configuration, connects to MongoDB, registers middleware, and mounts the API routers. A router applies the middleware required by its route—such as authentication, role checks, file upload handling, and request validation—before passing control to a controller.

Controllers contain the resource-specific behavior. Reusable CRUD operations are centralized in the factory handler, while Mongoose models define fields, validation rules, relationships, timestamps, and response serialization. All operational errors are forwarded to one global error handler so the API returns a consistent JSON response.

## Architecture

`app.js` loads environment variables, connects to MongoDB, enables JSON request parsing and static upload serving, mounts routers, then installs 404 and global error middleware.

Routers compose authentication, authorization, upload, validation, and controller middleware. Most resource operations delegate to reusable handlers in `Controllers/FactoyHandlers.cjs`; `utils/ApiFeatures.cjs` applies list-query behavior. Mongoose schemas define relationships and response serialization.

```text
.
├── .config/DataBaseConnection.cjs  # MongoDB connection
├── Controllers/                    # Auth, resource, and reusable CRUD controllers
├── middlewares/                    # Error, upload, and validation-result middleware
├── Models/                         # Mongoose schemas
├── Routers/                        # Express routers
├── uploads/                        # Processed local image files
├── utils/
│   ├── validators/                 # express-validator rules
│   ├── ApiFeatures.cjs             # Filtering, sorting, search, pagination
│   ├── CreateToken.cjs             # JWT signing helper
│   └── SendEmail.cjs               # Nodemailer helper
├── app.js
└── package.json
```

## Technology Stack

| Technology | Use in this project |
| --- | --- |
| Node.js / CommonJS | Runtime and module system |
| Express 5 | HTTP server and routing |
| MongoDB / Mongoose | Persistence, schemas, references, and query building |
| JSON Web Token | Access-token signing and verification |
| bcrypt | Password hashing and comparison |
| express-validator | Request validation |
| Multer + Sharp | Multipart uploads and JPEG processing |
| Nodemailer | Password-reset email delivery |
| dotenv | Environment-variable loading |

## Getting Started

### Prerequisites

- Node.js and npm
- A reachable MongoDB instance
- SMTP credentials if password recovery will be used

### Installation

```bash
git clone https://github.com/Abdelrahman-Ali769/E-commerce-Project.git
cd E-commerce-Project
npm install
```

Create the upload directories if they are not already present and ensure they are writable:

```text
uploads/categories
uploads/Brands
uploads/products
uploads/Users
```

### Environment Variables

Create a `.env` file at the repository root. Use your own values; do not commit this file.

```env
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000

JWT_SECRET_KEY=replace-with-a-long-random-secret
JWT_EXPIRE_TIME=7d

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-smtp-username
EMAIL_PASSWORD=your-smtp-password
```

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string. |
| `PORT` | HTTP port; defaults to `3000`. |
| `NODE_ENV` | `development` includes error details and stack traces; `production` maps invalid/expired JWT errors to client-safe responses. |
| `BASE_URL` | Base URL used to create category, product, and user image URLs. |
| `JWT_SECRET_KEY` | Secret used to sign and verify JWTs. |
| `JWT_EXPIRE_TIME` | JWT lifetime accepted by `jsonwebtoken` (for example, `7d`). |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE` | SMTP server configuration. `EMAIL_SECURE` must be the string `true` to enable a secure transport. |
| `EMAIL_USER`, `EMAIL_PASSWORD` | SMTP authentication and sender identity. |

### Run

```bash
npm start
```

The `start` script runs `nodemon --verbose app.js`. After MongoDB connects, the API listens on `http://localhost:<PORT>`. All application routes are mounted without an `/api/v1` prefix.

For a production-style start without file watching, run:

```bash
node app.js
```

## Authentication and Authorization

### JWT flow

`POST /api/auth/signup`, `POST /api/auth/Login`, and a successful password reset return a JWT. Send it on protected requests:

```http
Authorization: Bearer <token>
```

The `Protect` middleware verifies the signature and expiry, loads the current user, rejects missing/deactivated accounts, and rejects a token whose `iat` predates `passwordChangedAt`. `IsAllowTo(...)` then checks the current user's `role` for restricted routes.

### Role permissions

| Operation | User | Manager | Admin |
| --- | :---: | :---: | :---: |
| Browse categories, subcategories, brands, products | Yes | Yes | Yes |
| Create/update/delete categories, subcategories, brands, products | No | Yes | Yes |
| View/update/deactivate own account | Yes | Yes | Yes |
| Manage users through `/api/users` | No | No | Yes |

### Password recovery flow

1. Submit an email to `POST /api/auth/ForgotPassword`.
2. The server generates a six-digit code, stores its SHA-256 hash, sets a 10-minute expiry, and sends the plaintext code by SMTP email.
3. Submit the code to `POST /api/auth/VerifyResetCode`. A valid, unexpired code marks that user's reset request as verified.
4. Submit the email and new password to `PUT /api/auth/resetPassword` before expiry. The server saves the new bcrypt hash, clears reset data, and issues a JWT.

## API Reference

### Conventions

- Public read routes require no token.
- `Admin` and `Manager` mean a Bearer token with the stated role.
- Item IDs and `categoryId` URL parameters must be MongoDB ObjectIds where a validator is attached.
- Create/update endpoints use JSON unless an image field is supplied, in which case use `multipart/form-data`.
- Standard factory responses are `201` on create, `200` on successful get/update/delete, and include a `data` field. List responses also include `results` and `paginationResult`.

### Authentication

| Method | Path | Access | Body / behavior |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | Public | `name`, `email`, `password`, `passwordConfirm`; optional Egyptian `phone`. Returns a JWT. |
| POST | `/api/auth/Login` | Public | `email`, `password`. Returns a JWT for valid credentials. |
| POST | `/api/auth/ForgotPassword` | Public | `email`. Sends a reset code if the account exists. |
| POST | `/api/auth/VerifyResetCode` | Public | `resetCode` (exactly six digits). |
| PUT | `/api/auth/resetPassword` | Public | `email`, `newPassword` (minimum six characters). Requires a verified, unexpired reset request. |

> Route casing is intentional: the current implementation exposes `/Login`, `/ForgotPassword`, and `/VerifyResetCode` with capital letters.

### Users

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/users/getMe` | Any authenticated user | Get the current user. |
| PUT | `/api/users/updateMyPassword` | Any authenticated user | Change own password using `currentPassword` and `password`. Returns a new JWT. |
| PUT | `/api/users/updateMe` | Any authenticated user | Update own `name`, `email`, or `phone`; password, role, and active state are rejected. |
| PUT | `/api/users/deactivateMe` | Any authenticated user | Set own account to inactive. |
| GET | `/api/users` | Admin | List active users. |
| GET | `/api/users/:id` | Admin | Get a user. |
| POST | `/api/users` | Admin | Create a user; optional `ProfileImage` upload. |
| PUT | `/api/users/:id` | Admin | Update a user; optional `ProfileImage` upload. Password is rejected here. |
| PUT | `/api/users/change-password/:id` | Authenticated | Change the password at `:id`; requires `currentPassword`, `password`, and `passwordConfirm`. |
| DELETE | `/api/users/:id` | Admin | Soft-deactivate a user (`active: false`). |

User-create validation requires a 2–30 character name, unique valid email, password of at least six characters, matching `passwordConfirm`, and an optional Egyptian mobile number. Admin role input accepts `user` or `admin`; the schema also supports `manager`.

### Categories

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/category` | Public | List categories. |
| GET | `/api/category/:id` | Public | Get a category. |
| POST | `/api/category` | Admin or Manager | Create a category; `name` is required (3–32 characters); optional `image`. |
| PUT | `/api/category/:id` | Admin or Manager | Update a category; optional `image`. |
| DELETE | `/api/category/:id` | Admin or Manager | Delete a category document. |

### Subcategories

Subcategories are available as a standalone collection and as a nested category resource. The nested form automatically scopes the collection to its parent category.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/subcategory` | Public | List all subcategories. |
| GET | `/api/subcategory/:id` | Public | Get a subcategory. |
| POST | `/api/subcategory` | Admin or Manager | Create a subcategory with a `category` in the request body. |
| PUT | `/api/subcategory/:id` | Admin or Manager | Update a subcategory. |
| DELETE | `/api/subcategory/:id` | Admin or Manager | Delete a subcategory. |

#### Nested category routes

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/category/:categoryId/subcategories` | Public | List subcategories whose `category` matches `:categoryId`. |
| GET | `/api/category/:categoryId/subcategories/:id` | Public | Get one subcategory by `:id`. |
| POST | `/api/category/:categoryId/subcategories` | Admin or Manager | Create a subcategory. `name` is required (2–32 characters). If `category` is omitted from the body, it is set from `:categoryId`. |
| PUT | `/api/category/:categoryId/subcategories/:id` | Admin or Manager | Update a subcategory. |
| DELETE | `/api/category/:categoryId/subcategories/:id` | Admin or Manager | Delete a subcategory. |

### Brands

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/brand` | Public | List brands. |
| GET | `/api/brand/:id` | Public | Get a brand. |
| POST | `/api/brand` | Admin or Manager | Create a brand; `name` is required (5–15 characters); optional `image`. |
| PUT | `/api/brand/:id` | Admin or Manager | Update a brand; optional `image`. |
| DELETE | `/api/brand/:id` | Admin or Manager | Delete a brand document. |

### Products

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/product` | Public | List products. |
| GET | `/api/product/:id` | Public | Get a product. |
| POST | `/api/product` | Admin or Manager | Create a product; requires title, description, quantity, price, category, and `imageCover`. |
| PUT | `/api/product/:id` | Admin or Manager | Update supplied product fields and/or images. |
| DELETE | `/api/product/:id` | Admin or Manager | Delete a product document. |

Product creation validates title (3–150), description (20–5,000), numeric quantity and price, an existing category ID, optional brand ID, optional ratings, and optional subcategory IDs. Submitted subcategories must exist and belong to the submitted category. `priceAfterDiscount`, when supplied, must be lower than `price`.

## Images

Uploads are held in memory, accepted by filename extension (`jpg`, `jpeg`, `png`, `gif`, or `webp`), converted to JPEG, and saved locally. Static files are available at `/uploads/<path>`.

| Resource | Multipart field(s) | Processing and destination |
| --- | --- | --- |
| Category | `image` | 700×700 JPEG, quality 95; `uploads/categories/` |
| Brand | `image` | 700×700 JPEG, quality 95; `uploads/Brands/` |
| User | `ProfileImage` | 700×700 JPEG, quality 95; `uploads/Users/` |
| Product | `imageCover` (one), `images` (up to five) | 2000×1333 JPEG, quality 95; `uploads/products/` |

Category, product, and user serialization generate absolute URLs using `BASE_URL`. Brand responses store the filename as implemented. Replacing or deleting a record does not remove an old file from disk.

## Data Model

| Model | Important fields and relationships |
| --- | --- |
| `Category` | Unique `name`, generated `slug`, optional image. |
| `SubCategory` | Unique `name`, generated `slug`, and required `category` reference. |
| `Brand` | Unique `name`, generated `slug`, optional image. |
| `Product` | Unique title, description, stock, price, optional discount/colors/brand, required `category`, optional `subCategories`, images, and ratings. Category queries are populated with its name. |
| `User` | Name, unique email, phone, profile image, bcrypt password hash, role, `active`, password-change timestamp, and reset-code state. |

A product belongs to one category, can reference many subcategories, and can reference one brand. A subcategory belongs to one category.

## Querying Collections

All list endpoints use the shared `ApiFeatures` helper. Defaults are page `1`, limit `5`, and newest-first sorting (`-createdAt`).

| Query parameter | Behavior |
| --- | --- |
| Non-reserved field | MongoDB filter; `gte`, `gt`, `lte`, and `lt` are converted to comparison operators. |
| `sort` | Comma-separated fields; use `-` for descending order. |
| `fields` | Comma-separated field selection. |
| `keyword` | Products search case-insensitively across `title` and `description`; other list models search `name`. |
| `page`, `limit` | Pagination controls. Metadata includes `currentPage`, `limit`, `numberOfPages`, and conditionally `nextPage` / `PrevPage`. |

```http
GET /api/product?keyword=phone&price[gte]=500&sort=-price&fields=title,price,category&page=1&limit=5
```

## Validation and Errors

`express-validator` returns `400` with an `errors` array for route-validation failures. Unknown routes go through a `404` `ApiError`; missing documents in generic handlers return `404`. Async controllers use `express-async-handler` to reach the centralized error middleware.

In `development`, error responses include `status`, `message`, the error object, and a stack trace. In `production`, invalid and expired JWTs are converted to `401` messages and responses omit those development details.

An error response follows this general shape:

```json
{
  "status": "fail",
  "message": "Invalid User ID"
}
```

## Examples

### Register and log in

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "password": "strong-password",
    "passwordConfirm": "strong-password",
    "phone": "+201001234567"
  }'

curl -X POST http://localhost:3000/api/auth/Login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"strong-password"}'
```

### Access and update the signed-in user

```bash
curl http://localhost:3000/api/users/getMe \
  -H "Authorization: Bearer <token>"

curl -X PUT http://localhost:3000/api/users/updateMe \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Byron","phone":"+201001234567"}'
```

### Create a product with images

```bash
curl -X POST http://localhost:3000/api/product \
  -H "Authorization: Bearer <admin-or-manager-token>" \
  -F "title=Wireless Headphones" \
  -F "description=Over-ear wireless headphones with active noise cancellation." \
  -F "quantity=20" \
  -F "price=129.99" \
  -F "category=<CATEGORY_OBJECT_ID>" \
  -F "imageCover=@./cover.png" \
  -F "images=@./detail-1.jpg"
```

### Complete password recovery

```bash
curl -X POST http://localhost:3000/api/auth/ForgotPassword \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com"}'

curl -X POST http://localhost:3000/api/auth/VerifyResetCode \
  -H "Content-Type: application/json" \
  -d '{"resetCode":"123456"}'

curl -X PUT http://localhost:3000/api/auth/resetPassword \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","newPassword":"new-strong-password"}'
```

An illustrative successful login response has this shape:

```json
{
  "message": "Login successfully",
  "data": {
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "role": "user"
  },
  "token": "<jwt>"
}
```

## Project Structure

```text
.
├── .config/                 # Database connection
├── Controllers/             # Route behavior and reusable CRUD handlers
├── middlewares/             # Upload, validation-result, and error middleware
├── Models/                  # Mongoose schemas and model relationships
├── Routers/                 # Express route definitions
├── uploads/                 # Processed image files served publicly
├── utils/
│   ├── validators/          # Request validation rules
│   ├── ApiError.cjs         # Custom operational error class
│   ├── ApiFeatures.cjs      # Filtering, sorting, search, and pagination
│   ├── CreateToken.cjs      # JWT creation helper
│   └── SendEmail.cjs        # Nodemailer email helper
├── app.js                   # Application entry point
└── package.json             # Scripts and dependencies
```

## License

No license file is currently included in this repository.
