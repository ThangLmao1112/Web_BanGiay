import dotenv from "dotenv";
import mongoose from "mongoose";
import { Product } from "../src/models/product/product.model.js";
import { Image } from "../src/models/product/image.model.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const productSeeds = [
  {
    name: "Nike Canyon Sandal",
    description: "Lightweight daily sandal for men.",
    price: 85,
    sizes: ["39", "40", "41", "42"],
    colors: ["Black", "Brown"],
    category: "Gents Footwear",
    subcategory: "Sandals",
    stock: 30,
    images: [
      {
        color: "Black",
        imageUrl:
          "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Brown",
        imageUrl:
          "https://images.unsplash.com/photo-1621996659490-3275a6d1409f?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    name: "Adidas Adilette Comfort",
    description: "Comfort sandal with soft cushioning for men.",
    price: 78,
    sizes: ["40", "41", "42", "43"],
    colors: ["Navy", "White"],
    category: "Gents Footwear",
    subcategory: "Sandals",
    stock: 24,
    images: [
      {
        color: "Navy",
        imageUrl:
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "White",
        imageUrl:
          "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    name: "Nike Air Zoom Pegasus",
    description: "Responsive sneaker for all-day movement.",
    price: 140,
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["Black", "Blue"],
    category: "Gents Footwear",
    subcategory: "Sneakers",
    stock: 20,
    images: [
      {
        color: "Black",
        imageUrl:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Blue",
        imageUrl:
          "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    name: "New Balance 574",
    description: "Classic men sneaker with stable comfort.",
    price: 125,
    sizes: ["40", "41", "42", "43"],
    colors: ["Gray", "Green"],
    category: "Gents Footwear",
    subcategory: "Sneakers",
    stock: 18,
    images: [
      {
        color: "Gray",
        imageUrl:
          "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Green",
        imageUrl:
          "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    name: "Birkenstock Arizona",
    description: "Women sandal with ergonomic footbed.",
    price: 110,
    sizes: ["36", "37", "38", "39"],
    colors: ["Cream", "Black"],
    category: "Ladies Footwear",
    subcategory: "Sandals",
    stock: 26,
    images: [
      {
        color: "Cream",
        imageUrl:
          "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Black",
        imageUrl:
          "https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    name: "FitFlop Lulu Cross",
    description: "Soft daily women sandal with cushioned sole.",
    price: 95,
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["Pink", "Tan"],
    category: "Ladies Footwear",
    subcategory: "Sandals",
    stock: 22,
    images: [
      {
        color: "Pink",
        imageUrl:
          "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Tan",
        imageUrl:
          "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    name: "Nike Air Max 97 Women",
    description: "Women sneaker with iconic layered design.",
    price: 155,
    sizes: ["36", "37", "38", "39"],
    colors: ["White", "Purple"],
    category: "Ladies Footwear",
    subcategory: "Sneakers",
    stock: 16,
    images: [
      {
        color: "White",
        imageUrl:
          "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Purple",
        imageUrl:
          "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    name: "Puma RS-X Women",
    description: "Bold women sneaker for streetwear outfits.",
    price: 132,
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["Black", "Rose"],
    category: "Ladies Footwear",
    subcategory: "Sneakers",
    stock: 20,
    images: [
      {
        color: "Black",
        imageUrl:
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Rose",
        imageUrl:
          "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
];

const runSeed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Missing MONGODB_URI in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    const categoriesToReset = ["Gents Footwear", "Ladies Footwear"];

    const existingProducts = await Product.find(
      { category: { $in: categoriesToReset } },
      { _id: 1 }
    ).lean();

    const existingProductIds = existingProducts.map((product) => product._id);

    if (existingProductIds.length > 0) {
      await Image.deleteMany({ productId: { $in: existingProductIds } });
      await Product.deleteMany({ _id: { $in: existingProductIds } });
    }

    for (const seed of productSeeds) {
      const { images, ...productData } = seed;

      const product = await Product.create(productData);

      for (const image of images) {
        await Image.create({ ...image, productId: product._id });
      }
    }

    console.log("Seeded 8 products evenly across Sandals/Sneakers for men and women.");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

runSeed();
