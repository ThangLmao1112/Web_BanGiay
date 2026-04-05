import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { Product } from "../src/models/product/product.model.js";
import { Image } from "../src/models/product/image.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const products = await Product.find(
      { category: { $in: ["Gents Footwear", "Ladies Footwear"] } },
      { name: 1, category: 1 }
    )
      .sort({ category: 1, name: 1 })
      .lean();

    for (const product of products) {
      console.log(`--- ${product.category} | ${product.name}`);
      const images = await Image.find(
        { productId: product._id },
        { color: 1, imageUrl: 1 }
      ).lean();
      images.forEach((img) => {
        console.log(`${img.color} => ${img.imageUrl}`);
      });
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
