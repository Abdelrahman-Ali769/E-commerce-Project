const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const ProductModel = require("../../Models/ProductSchema.cjs");

dotenv.config({
  path: `${__dirname}/../../.env`,
});

mongoose.set("strictQuery", false);

// Connect to Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// Read Products JSON File
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, "utf-8")
);

// Insert Data
const InsertData = async () => {
  try {
    await ProductModel.create(products);

    console.log("Data Inserted Successfully.");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Delete Data
const DeleteData = async () => {
  try {
    await ProductModel.deleteMany();

    console.log("Data Deleted Successfully.");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Run Seeder
// node seeder.js -i => Insert Data
// node seeder.js -d => Delete Data

if (process.argv[2] === "-i") {
  InsertData();
} else if (process.argv[2] === "-d") {
  DeleteData();
}