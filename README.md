# E-Commerce REST API

A Node.js REST API for managing an e-commerce catalog and user records. The current implementation provides CRUD endpoints for categories, nested subcategories, brands, products, and users; MongoDB persistence; request validation; local image processing; and collection query features.

> This is an API-only project. It does not include a frontend, shopping cart, orders, payments, reviews, wishlists, or an active login/authentication flow.

## Features

- Category, brand, product, and user create/read/update/delete operations.
- Nested subcategory operations under a category.
- Soft deactivation of users (`active: false`) instead of deleting their records.
- Automatic slugs for category, subcategory, brand, product, and user names/titles when validated.
- Product-to-category, product-to-subcategory, and product-to-brand references.
- Multer uploads, Sharp JPEG conversion/resizing, and local image storage.
- Static serving of files under `/uploads`.
- Filtering, sorting, field selection, keyword search, and pagination for collection endpoints.
- Central error handler, validation errors, 404 handling, and process-level unhandled-error logging.
- A product seed script with sample data in `utils/dummyData/products.json`.

## Technologies & Dependencies

| Package / technology | Current use |
| --- | --- |
| Node.js / CommonJS | Runtime and module system |
| Express `^5.2.1` | HTTP server and routing |
| MongoDB / Mongoose `^9.8.0` | Persistence, schemas, and references |
| dotenv `^17.4.2` | Loads environment variables |
| express-validator `^7.3.2` | Request validation |
| multer `^2.3.0` | In-memory multipart image upload handling |
| sharp `^0.35.4` | Image resize and JPEG processing |
| slugify `^1.6.9` | Slug creation in validators |
| express-async-handler `^1.2.0` | Async controller error forwarding |
| uuid `^14.0.2` | Unique uploaded-image filenames |
| nodemon `^3.1.14` | Development server launched by `npm start` |

`bcrypt`, `jsonwebtoken`, `body-parser`, `cors`, and `morgan` are listed in `package.json`, but they are not used by the application code at present.

## Project Architecture

`app.js` loads environment variables, connects to MongoDB through `.config/DataBaseConnection.cjs`, configures Express JSON parsing and static uploads, mounts routers, and installs the 404 and global error handlers.

Routers compose validators and upload/resize middleware before delegating to controllers. Most controllers use reusable CRUD functions in `Controllers/FactoyHandlers.cjs`. Mongoose models define persistence and response transformations. Query behavior is centralized in `utils/ApiFeatures.cjs`.

## Project Structure

```text
.
├── .config/
│   └── DataBaseConnection.cjs    # MongoDB connection
├── Controllers/                  # Resource controllers and shared CRUD handlers
├── middlewares/                  # Upload, validation-result, and error middleware
├── Models/                       # Category, SubCategory, Brand, Product, User schemas
├── Routers/                      # Express route definitions
├── uploads/                      # Locally processed image files
├── utils/
│   ├── validators/               # express-validator rules per resource
│   ├── dummyData/                # Product JSON and seeder script
│   ├── ApiError.cjs
│   └── ApiFeatures.cjs
├── app.js                         # Application entry point and HTTP server
└── package.json
```

## Installation & Setup

Prerequisites: Node.js, npm, and a reachable MongoDB database.

```bash
git clone <repository-url>
cd "Project E-Commerce"
npm install
```

Create `.env` in the repository root:

```env
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000
```

Ensure the existing upload directories are writable: `uploads/categories`, `uploads/Brands`, `uploads/products`, and `uploads/Users`.

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB connection URI used at startup and by the seed script. |
| `PORT` | No | HTTP port; defaults to `3000`. |
| `NODE_ENV` | No | `development` includes an error object and stack trace in error responses; other values return a reduced response. |
| `BASE_URL` | Yes for generated image URLs | Base URL prepended to serialized category and product image paths. |

## Running the Project

```bash
npm start
```

The `start` script runs `nodemon --verbose app.js`. The API listens on `PORT` after a successful MongoDB connection.

### Product seed data

The standalone seeder is not exposed through npm scripts. From `utils/dummyData`:

```bash
node seeder.js -i # insert products from products.json
node seeder.js -d # delete every Product document
```

Use `-d` carefully: it calls `ProductModel.deleteMany()` with no filter.

## API Endpoints

All routes are mounted exactly as shown. No `/api/v1` prefix is implemented.

| Resource | Method | Path | Notes |
| --- | --- | --- | --- |
| Categories | GET | `/api/category` | List categories |
| Categories | GET | `/api/category/:id` | Get one category |
| Categories | POST | `/api/category` | Multipart field: `image` (optional) |
| Categories | PUT | `/api/category/:id` | Multipart field: `image` (optional) |
| Categories | DELETE | `/api/category/:id` | Permanently deletes the document |
| Subcategories | GET | `/api/category/:categoryId/subcategories` | Lists the specified category’s subcategories |
| Subcategories | GET | `/api/category/:categoryId/subcategories/:id` | Gets one subcategory by `id` |
| Subcategories | POST | `/api/category/:categoryId/subcategories` | Sets `category` from the URL only when absent from the body |
| Subcategories | PUT | `/api/category/:categoryId/subcategories/:id` | Updates by `id` |
| Subcategories | DELETE | `/api/category/:categoryId/subcategories/:id` | Permanently deletes by `id` |
| Brands | GET | `/api/brand` | List brands |
| Brands | GET | `/api/brand/:id` | Get one brand |
| Brands | POST | `/api/brand` | Multipart field: `image` (optional) |
| Brands | PUT | `/api/brand/:id` | Multipart field: `image` (optional) |
| Brands | DELETE | `/api/brand/:id` | Permanently deletes the document |
| Products | GET | `/api/product` | List products |
| Products | GET | `/api/product/:id` | Get one product |
| Products | POST | `/api/product` | Multipart: `imageCover` (one), `images` (up to five) |
| Products | PUT | `/api/product/:id` | Same optional image fields as create |
| Products | DELETE | `/api/product/:id` | Permanently deletes the document |
| Users | GET | `/api/users` | Lists users where `active` is `true` |
| Users | GET | `/api/users/:id` | Get one user, including inactive users when addressed directly |
| Users | POST | `/api/users` | Multipart field: `ProfileImage` (optional) |
| Users | PUT | `/api/users/:id` | Multipart field: `ProfileImage` (optional) |
| Users | DELETE | `/api/users/:id` | Sets `active` to `false` |
| Static uploads | GET | `/uploads/<path>` | Serves local files from `uploads/` |

## Authentication & Authorization

**In Progress / not implemented.** There is no authentication middleware, token issuance or verification, password hashing, role check, or route protection. Every mounted endpoint is callable without credentials, even where inline source comments label an operation “Private.”

The `User` model has `role` values of `user` or `admin`, and `bcrypt`/`jsonwebtoken` are installed dependencies, but they are not integrated. User passwords are currently stored directly through the generic create/update handler, so this API is not production-ready for credential storage.

## Database Models & Relationships

| Model | Key fields and behavior |
| --- | --- |
| `Category` | Unique `name`, `slug`, optional `image`, timestamps. Serialization removes `_id` and exposes virtual `imageUrl`. |
| `SubCategory` | Unique `name`, `slug`, required `category` reference to `Category`, timestamps. |
| `Brand` | Unique `name`, `slug`, optional `image`, timestamps. |
| `Product` | Unique `title`; description, stock and pricing fields; images; optional colors and brand; required `category`; optional `subCategories`; ratings; timestamps. Every `find` query populates `category` with `name`. Serialization builds `BASE_URL` product image URLs and groups ratings under `ratings`. |
| `User` | Name, unique email, optional phone and `ProfileImage`, password, `role` (`user`/`admin`), `active`, and timestamps. |

- A `SubCategory` belongs to one `Category`.
- A `Product` belongs to one `Category`, can reference many `SubCategory` documents, and can reference one `Brand`.
- Product-create validation checks that referenced subcategories exist and belong to the submitted category.

## Validation

Validation uses `express-validator`; failures return HTTP `400` with an `errors` array.

- Category names: required on create, 3–32 characters; valid MongoDB IDs are required for item operations.
- Subcategory names: required on create, 2–32 characters; a MongoDB `category` ID is required.
- Brand names: required on create, 5–15 characters; update requires 2–15 characters.
- Products: title (3–150), description (20–5,000), quantity, price, cover image, and a valid existing category are required on create. Discount price must be lower than price; optional ratings, color arrays, brand IDs, and subcategory arrays are checked as implemented.
- Users: name (2–30), unique valid email, password of at least six characters, matching `passwordConfirm`, optional Egyptian (`ar-EG`) mobile phone, `role`, and `active` are validated on create. Updates validate supplied fields and email uniqueness.

Mongoose also enforces schema-level required fields, uniqueness, numeric bounds, enum values, and string constraints. Update operations use `findByIdAndUpdate` without `runValidators`, so Mongoose schema validators are not applied to generic updates; route validators cover only their implemented fields.

## Image Upload & Processing

Image uploads are held in memory by Multer. The filter accepts filenames ending in `jpg`, `jpeg`, `png`, `gif`, or `webp`; it does not enforce a MIME type or a file-size limit.

| Resource | Form field(s) | Output |
| --- | --- | --- |
| Category | `image` | 700×700 JPEG, quality 95, `uploads/categories/` |
| Brand | `image` | 700×700 JPEG, quality 95, `uploads/Brands/` |
| User | `ProfileImage` | 700×700 JPEG, quality 95, `uploads/Users/` |
| Product | `imageCover`; `images` | 2000×1333 JPEG, quality 95, `uploads/products/`; maximum one cover and five additional images |

New image files are written during create/update requests; the implementation does not delete replaced or orphaned files. Category and product JSON responses construct absolute image URLs using `BASE_URL`; brand and user responses retain the saved filename.

## Error Handling

- Unknown routes produce a `404` `ApiError` response.
- Route validation failures produce `400` with `{ "errors": [...] }`.
- Missing documents in shared get/update/delete handlers produce `404` errors.
- Mongoose `ValidationError` errors are marked as `400` by the global handler.
- `express-async-handler` forwards async controller errors to the global handler.
- In `development`, responses include `status`, `message`, `error`, and `stack`; other modes return only `status` and `message`.
- Uncaught exceptions and unhandled promise rejections are logged; the process exits after closing the HTTP server when possible.

## Filtering, Sorting, Searching & Pagination

All collection endpoints use `ApiFeatures`. The default page is `1`, default limit is `5`, and default sort is newest first (`-createdAt`).

| Query parameter | Behavior |
| --- | --- |
| Any non-reserved field | Filter passed to MongoDB; `gte`, `gt`, `lte`, and `lt` are converted to MongoDB comparison operators. |
| `sort` | Comma-separated sort fields; prefix a field with `-` for descending. |
| `fields` | Comma-separated field selection. |
| `keyword` | Products: case-insensitive title or description match. Other list models: case-insensitive name match. |
| `page`, `limit` | Pagination controls. Response metadata includes `currentPage`, `limit`, `numberOfPages`, and conditionally `nextPage` / `PrevPage`. |

```http
GET /api/product?keyword=phone&price[gte]=500&sort=-price&fields=title,price,category&page=1&limit=5
```

For nested subcategory lists, the category filter is applied before these query options.

## API Request/Response Examples

Create a product with multipart data:

```bash
curl -X POST http://localhost:3000/api/product \
  -F "title=Wireless Headphones" \
  -F "description=Over-ear wireless headphones with active noise cancellation." \
  -F "quantity=20" \
  -F "price=129.99" \
  -F "category=<CATEGORY_OBJECT_ID>" \
  -F "imageCover=@./cover.png" \
  -F "images=@./detail-1.jpg"
```

Successful generic creation responses follow this shape:

```json
{
  "message": "Document created successfully.",
  "data": {
    "title": "Wireless Headphones",
    "slug": "wireless-headphones",
    "price": 129.99
  }
}
```

List responses include results and pagination metadata:

```json
{
  "results": 1,
  "paginationResult": {
    "currentPage": 1,
    "limit": 5,
    "numberOfPages": 1
  },
  "message": "Document retrieved successfully.",
  "data": []
}
```

## Future Improvements

- Authentication, authorization, password hashing, and restricted administrative routes.
- Cart, wishlist, orders, payments, reviews, and inventory/order workflows.
- Request logging, CORS configuration, security headers, rate limiting, and upload size/MIME validation.
- Referential-integrity handling for deletion and cleanup of replaced/orphaned upload files.
- Automated tests, API specification (OpenAPI), CI/CD, and production deployment configuration.
- A standalone subcategory router if non-nested subcategory URLs are desired.

## Author
Abdelrahman Ali Elshenawy
