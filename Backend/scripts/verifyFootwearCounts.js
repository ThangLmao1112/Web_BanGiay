import dotenv from "dotenv";
import mongoose from "mongoose";
import { Product } from "../src/models/product/product.model.js";
import { Image } from "../src/models/product/image.model.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const gentsCount = await Product.countDocuments({
      category: "Gents Footwear",
    });
    const ladiesCount = await Product.countDocuments({
      category: "Ladies Footwear",
    });

    const bySubcategory = await Product.aggregate([
      {
        $match: {
          category: { $in: ["Gents Footwear", "Ladies Footwear"] },
        },
      },
      {
        $group: {
          _id: { category: "$category", subcategory: "$subcategory" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.category": 1, "_id.subcategory": 1 } },
    ]);

    console.log("Product counts:");
    console.log(`- Gents Footwear: ${gentsCount}`);
    console.log(`- Ladies Footwear: ${ladiesCount}`);
    console.log("- Breakdown by subcategory:");

    bySubcategory.forEach((row) => {
      console.log(
        `  - ${row._id.category} / ${row._id.subcategory}: ${row.count}`
      );
    });

    const products = await Product.find(
      { category: { $in: ["Gents Footwear", "Ladies Footwear"] } },
      { _id: 1, name: 1, category: 1 }
    ).lean();

    const images = await Image.find(
      { productId: { $in: products.map((p) => p._id) } },
      { productId: 1, imageUrl: 1 }
    ).lean();

    const productCategoryMap = new Map(
      products.map((product) => [String(product._id), product.category])
    );

    const menNames = new Set(
      products
        .filter((p) => p.category === "Gents Footwear")
        .map((p) => p.name.toLowerCase())
    );
    const womenNames = new Set(
      products
        .filter((p) => p.category === "Ladies Footwear")
        .map((p) => p.name.toLowerCase())
    );

    const duplicateNamesAcrossCategories = [...menNames].filter((name) =>
      womenNames.has(name)
    );

    const menImageUrls = new Set(
      images
        .filter((img) => productCategoryMap.get(String(img.productId)) === "Gents Footwear")
        .map((img) => img.imageUrl)
    );
    const womenImageUrls = new Set(
      images
        .filter((img) => productCategoryMap.get(String(img.productId)) === "Ladies Footwear")
        .map((img) => img.imageUrl)
    );

    const duplicateImageUrlsAcrossCategories = [...menImageUrls].filter((url) =>
      womenImageUrls.has(url)
    );

    console.log("- Duplicate names across men/women:", duplicateNamesAcrossCategories.length);
    console.log("- Duplicate image URLs across men/women:", duplicateImageUrlsAcrossCategories.length);

    if (
      duplicateNamesAcrossCategories.length > 0 ||
      duplicateImageUrlsAcrossCategories.length > 0
    ) {
      console.log("  Duplicated names:", duplicateNamesAcrossCategories);
      console.log("  Duplicated image URLs:", duplicateImageUrlsAcrossCategories);
      process.exitCode = 1;
    }
  } catch (error) {
    console.error("Verification failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
