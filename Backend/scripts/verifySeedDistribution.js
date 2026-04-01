import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const rows = await mongoose.connection.db.collection("products").aggregate([
    {
      $match: {
        category: { $in: ["Gents Footwear", "Ladies Footwear"] },
        subcategory: { $in: ["Sandals", "Sneakers"] },
      },
    },
    {
      $group: {
        _id: { category: "$category", subcategory: "$subcategory" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.category": 1, "_id.subcategory": 1 },
    },
  ]).toArray();

  const totalProducts = await mongoose.connection.db.collection("products").countDocuments({
    category: { $in: ["Gents Footwear", "Ladies Footwear"] },
  });

  const totalImages = await mongoose.connection.db.collection("images").countDocuments();

  console.log("Distribution:");
  console.log(JSON.stringify(rows, null, 2));
  console.log("totalProductsInMenWomen=", totalProducts);
  console.log("totalImages=", totalImages);

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Verification failed:", error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
});
