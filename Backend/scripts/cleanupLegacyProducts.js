import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const ALLOWED_SUBCATEGORIES = ["Sandals", "Sneakers"];
const TARGET_CATEGORIES = ["Gents Footwear", "Ladies Footwear"];
const LEGACY_SUBCATEGORIES = ["Shoes", "Slippers", "Pumps"];

const runCleanup = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Missing MONGODB_URI in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    const db = mongoose.connection.db;

    const legacyProducts = await db
      .collection("products")
      .find({
        category: { $in: TARGET_CATEGORIES },
        subcategory: { $nin: ALLOWED_SUBCATEGORIES },
      })
      .project({ _id: 1, name: 1, subcategory: 1 })
      .toArray();

    const legacyProductIds = legacyProducts.map((p) => p._id);

    const deletedProductsResult = await db.collection("products").deleteMany({
      _id: { $in: legacyProductIds },
    });

    const deletedImagesByProductResult = await db.collection("images").deleteMany({
      productId: { $in: legacyProductIds },
    });

    const remainingProductIds = await db
      .collection("products")
      .find({}, { projection: { _id: 1 } })
      .toArray();
    const remainingProductIdSet = new Set(
      remainingProductIds.map((p) => p._id.toString())
    );

    const allImages = await db
      .collection("images")
      .find({}, { projection: { _id: 1, productId: 1 } })
      .toArray();

    const orphanImageIds = allImages
      .filter((img) => !remainingProductIdSet.has(String(img.productId)))
      .map((img) => img._id);

    const deletedOrphanImagesResult = orphanImageIds.length
      ? await db.collection("images").deleteMany({ _id: { $in: orphanImageIds } })
      : { deletedCount: 0 };

    const deletedLegacyCategoriesResult = await db.collection("categories").deleteMany({
      name: { $in: LEGACY_SUBCATEGORIES },
    });

    console.log("Cleanup summary:");
    console.log("- Legacy products found:", legacyProducts.length);
    console.log("- Products deleted:", deletedProductsResult.deletedCount);
    console.log("- Images deleted by removed products:", deletedImagesByProductResult.deletedCount);
    console.log("- Orphan images deleted:", deletedOrphanImagesResult.deletedCount);
    console.log("- Legacy categories deleted:", deletedLegacyCategoriesResult.deletedCount);

    if (legacyProducts.length > 0) {
      console.log("Removed products:");
      legacyProducts.forEach((p) => {
        console.log(`  - ${p.name} [${p.subcategory}]`);
      });
    }

    console.log("Done.");
  } catch (error) {
    console.error("Cleanup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

runCleanup();
