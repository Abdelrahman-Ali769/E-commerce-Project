const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const ProductModel = require("../Models/ProductSchema.cjs");

dotenv.config();

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const products = JSON.parse(
  fs.readFileSync("./utils/dummyData/products.json", "utf-8")
);

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

if (process.argv[2] === "-i") {
  InsertData();
} else if (process.argv[2] === "-d") {
  DeleteData();
}