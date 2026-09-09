# 🛒 E-Commerce REST API

Backend REST API لمتجر إلكتروني مبني بـ **Node.js** و**Express** و**MongoDB/Mongoose**. المشروع حاليًا يوفّر إدارة المنتجات والتصنيفات والتصنيفات الفرعية والعلامات التجارية، مع البحث والفلاتر ورفع صور التصنيفات.

## ✨ المميزات المنفذة

- CRUD كامل للـ Products وCategories وSubcategories وBrands.
- ربط الـ Subcategory بالـ Category، ودعم المسارات المتداخلة.
- التحقق من بيانات الطلبات باستخدام Express Validator.
- إنشاء `slug` تلقائيًا من الاسم أو العنوان.
- رفع صورة Category، تحويلها إلى JPEG، وتغيير أبعادها باستخدام Sharp.
- تخزين الصور محليًا داخل `uploads/categories` وإتاحتها من `/uploads`.
- Filtering وSorting وField limiting وSearch وPagination.
- معالجات CRUD مشتركة لتقليل تكرار الكود.
- Error handling مركزي، مع التعامل مع 404 وعمليات الرفض غير المعالجة.

## 🧰 التقنيات

- Node.js وExpress 5
- MongoDB وMongoose
- Express Validator
- Multer وSharp
- Slugify وUUID
- Dotenv وMorgan وCORS

> توجد حزم `bcrypt` و`jsonwebtoken` تمهيدًا لإضافة التسجيل وتسجيل الدخول، لكن المصادقة لم تُنفّذ بعد.

## 📁 هيكل المشروع

```text
Project E-Commerce/
├── .config/             # الاتصال بقاعدة البيانات
├── Controllers/         # منطق الـ API ومعالجات CRUD
├── Models/              # Mongoose schemas
├── Routers/             # API routes
├── middlewares/         # التحقق ومعالجة الأخطاء
├── uploads/categories/  # صور التصنيفات محليًا
├── utils/               # أدوات مساعدة وvalidators وبيانات تجريبية
├── app.js
└── package.json
```

## ⚙️ التشغيل محليًا

1. ثبّت الحزم:

   ```bash
   npm install
   ```

2. أضف ملف `.env` في جذر المشروع:

   ```env
   PORT=8080
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

3. شغّل الخادم:

   ```bash
   npm start
   ```

الخادم يعمل افتراضيًا على `http://localhost:8080`.

## 🔗 المسارات الحالية

| المورد | Base route |
|---|---|
| Products | `/api/product` |
| Categories | `/api/category` |
| Subcategories | `/api/subcategory` |
| Subcategories داخل Category | `/api/category/:categoryId/subcategories` |
| Brands | `/api/brand` |
| الملفات المرفوعة | `/uploads/...` |

### أمثلة

```http
GET /api/product?keyword=phone&sort=price&fields=title,price&limit=10&page=1
GET /api/category/:categoryId/subcategories
POST /api/category
```

عند إنشاء أو تعديل Category، أرسل الصورة في حقل `image` باستخدام `multipart/form-data`.

## 🗺️ خارطة التطوير

المرحلة الحالية هي استكمال صور المنتجات والعلامات التجارية. بعد ذلك سيتم العمل بالترتيب التالي:

- [ ] Authentication and Authorization: User model، Register، Login، JWT، والصلاحيات.
- [ ] Reviews، Wishlist، وعناوين المستخدمين.
- [ ] Coupons وShopping Cart.
- [ ] Cash/Online Orders، Payment، وDeployment.
- [ ] Security best practices والتوصيات.
- [ ] Swagger / OpenAPI documentation.
- [ ] Unit وIntegration tests.

## 🧪 الاختبارات

لا توجد اختبارات آلية مضافة حتى الآن.

## 👨‍💻 Author

**Abdelrahman Ali Elshenawy**
Backend Developer in progress 🚀
