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
    name: "New Balance 574 Core",
    description: "Classic running-inspired men sneaker with stable midsole.",
    price: 125,
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["Gray", "Green"],
    category: "Gents Footwear",
    subcategory: "Sneakers",
    stock: 26,
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
    name: "Nike Air Max 90",
    description: "Everyday men sneaker with visible Air cushioning.",
    price: 152,
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["White", "Black"],
    category: "Gents Footwear",
    subcategory: "Sneakers",
    stock: 22,
    images: [
      {
        color: "White",
        imageUrl:
          "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Black",
        imageUrl:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    name: "Adidas Campus 00s",
    description: "Retro suede men sneaker for daily street style.",
    price: 138,
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["Navy", "Cream"],
    category: "Gents Footwear",
    subcategory: "Sneakers",
    stock: 20,
    images: [
      {
        color: "Navy",
        imageUrl:
          "https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Cream",
        imageUrl:
          "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    name: "Puma RS-X Efekt",
    description: "Chunky men sneaker with bold silhouette and comfort foam.",
    price: 133,
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["Black", "Multicolor"],
    category: "Gents Footwear",
    subcategory: "Sneakers",
    stock: 19,
    images: [
      {
        color: "Black",
        imageUrl:
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Multicolor",
        imageUrl:
          "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    name: "Converse Chuck 70 High",
    description: "High-top canvas men sneaker with vintage details.",
    price: 118,
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["Black", "Off White"],
    category: "Gents Footwear",
    subcategory: "Sneakers",
    stock: 24,
    images: [
      {
        color: "Black",
        imageUrl:
          "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Off White",
        imageUrl:
          "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    name: "Birkenstock Arizona Men",
    description: "Men double-strap sandal with contoured cork footbed.",
    price: 109,
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["Brown", "Black"],
    category: "Gents Footwear",
    subcategory: "Sandals",
    stock: 28,
    images: [
      {
        color: "Brown",
        imageUrl:
          "https://images.unsplash.com/photo-1621996659490-3275a6d1409f?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Black",
        imageUrl:
          "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    name: "Teva Hurricane XLT2",
    description: "Outdoor men sandal with rugged grip and adjustable straps.",
    price: 98,
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["Olive", "Navy"],
    category: "Gents Footwear",
    subcategory: "Sandals",
    stock: 21,
    images: [
      {
        color: "Olive",
        imageUrl:
          "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Navy",
        imageUrl:
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    name: "Nike Oneonta Men",
    description: "Quick-dry men sandal for city walks and travel.",
    price: 89,
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["Gray", "Black"],
    category: "Gents Footwear",
    subcategory: "Sandals",
    stock: 18,
    images: [
      {
        color: "Gray",
        imageUrl:
          "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Black",
        imageUrl:
          "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    name: "Keen Newport H2",
    description: "Protective toe men sandal for all-day comfort.",
    price: 114,
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["Brown", "Dark Gray"],
    category: "Gents Footwear",
    subcategory: "Sandals",
    stock: 17,
    images: [
      {
        color: "Brown",
        imageUrl:
          "https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Dark Gray",
        imageUrl:
          "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    name: "Adidas Adilette Comfort Men",
    description: "Slide sandal with cloudfoam sole for men.",
    price: 77,
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["White", "Navy"],
    category: "Gents Footwear",
    subcategory: "Sandals",
    stock: 30,
    images: [
      {
        color: "White",
        imageUrl:
          "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Navy",
        imageUrl:
          "https://images.unsplash.com/photo-1624005340908-c9ac6b91f8a9?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    name: "Nike Air Force 1 Shadow Women",
    description: "Women sneaker with layered details and soft cushioning.",
    price: 148,
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["White", "Pastel"],
    category: "Ladies Footwear",
    subcategory: "Sneakers",
    stock: 23,
    images: [
      {
        color: "White",
        imageUrl:
          "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      {
        color: "Pastel",
        imageUrl:
          "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    ],
  },
  {
    name: "Adidas Stan Smith Women",
    description: "Minimal leather women sneaker with timeless design.",
    price: 132,
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["White Green", "White Pink"],
    category: "Ladies Footwear",
    subcategory: "Sneakers",
    stock: 24,
    images: [
      {
        color: "White Green",
        imageUrl:
          "https://images.pexels.com/photos/267202/pexels-photo-267202.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      {
        color: "White Pink",
        imageUrl:
          "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    ],
  },
  {
    name: "New Balance 327 Women",
    description: "Retro-inspired women sneaker with lightweight comfort.",
    price: 136,
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["Beige", "Gray"],
    category: "Ladies Footwear",
    subcategory: "Sneakers",
    stock: 21,
    images: [
      {
        color: "Beige",
        imageUrl:
          "https://images.pexels.com/photos/19090/pexels-photo-19090.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      {
        color: "Gray",
        imageUrl:
          "https://images.pexels.com/photos/1456737/pexels-photo-1456737.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    ],
  },
  {
    name: "Puma Cali Star Women",
    description: "Women platform sneaker for casual street outfits.",
    price: 129,
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["White", "Black"],
    category: "Ladies Footwear",
    subcategory: "Sneakers",
    stock: 19,
    images: [
      {
        color: "White",
        imageUrl:
          "https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      {
        color: "Black",
        imageUrl:
          "https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    ],
  },
  {
    name: "Skechers D'Lites Women",
    description: "Comfort women sneaker with breathable mesh upper.",
    price: 119,
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["White", "Silver"],
    category: "Ladies Footwear",
    subcategory: "Sneakers",
    stock: 20,
    images: [
      {
        color: "White",
        imageUrl:
          "https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      {
        color: "Silver",
        imageUrl:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    name: "Birkenstock Gizeh Women",
    description: "Women flat thong sandal with ergonomic arch support.",
    price: 104,
    sizes: ["35", "36", "37", "38", "39"],
    colors: ["Black", "Stone"],
    category: "Ladies Footwear",
    subcategory: "Sandals",
    stock: 27,
    images: [
      {
        color: "Black",
        imageUrl:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Stone",
        imageUrl:
          "https://images.unsplash.com/photo-1600185365488-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    name: "FitFlop Lulu Women",
    description: "Women flat slide sandal with soft cushioning and light weight.",
    price: 92,
    sizes: ["35", "36", "37", "38", "39", "40"],
    colors: ["Tan", "Rose Gold"],
    category: "Ladies Footwear",
    subcategory: "Sandals",
    stock: 25,
    images: [
      {
        color: "Tan",
        imageUrl:
          "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Rose Gold",
        imageUrl:
          "https://images.pexels.com/photos/1456854/pexels-photo-1456854.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    ],
  },
  {
    name: "Teva Midform Universal Women",
    description: "Sporty women flat sandal with secure adjustable straps.",
    price: 96,
    sizes: ["35", "36", "37", "38", "39", "40"],
    colors: ["Olive", "Black"],
    category: "Ladies Footwear",
    subcategory: "Sandals",
    stock: 19,
    images: [
      {
        color: "Olive",
        imageUrl:
          "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Black",
        imageUrl:
          "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    ],
  },
  {
    name: "Crocs LiteRide Sandal Women",
    description: "Women casual flat sandal with lightweight foam comfort.",
    price: 88,
    sizes: ["35", "36", "37", "38", "39"],
    colors: ["Bone", "Black"],
    category: "Ladies Footwear",
    subcategory: "Sandals",
    stock: 24,
    images: [
      {
        color: "Bone",
        imageUrl:
          "https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Black",
        imageUrl:
          "https://images.pexels.com/photos/1456735/pexels-photo-1456735.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    ],
  },
  {
    name: "Clarks Breeze Sea Women",
    description: "Minimal women flat sandal for smart casual outfits.",
    price: 83,
    sizes: ["35", "36", "37", "38", "39"],
    colors: ["Beige", "Black"],
    category: "Ladies Footwear",
    subcategory: "Sandals",
    stock: 22,
    images: [
      {
        color: "Beige",
        imageUrl:
          "https://images.unsplash.com/photo-1605408499391-6368c628ef42?auto=format&fit=crop&w=1200&q=80",
      },
      {
        color: "Black",
        imageUrl:
          "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
];

const validateSeedData = () => {
  const menProducts = productSeeds.filter((p) => p.category === "Gents Footwear");
  const womenProducts = productSeeds.filter((p) => p.category === "Ladies Footwear");

  const menNames = new Set(menProducts.map((p) => p.name.toLowerCase()));
  const womenNames = new Set(womenProducts.map((p) => p.name.toLowerCase()));
  const duplicatedNames = [...menNames].filter((name) => womenNames.has(name));

  const menImageUrls = new Set(
    menProducts.flatMap((p) => (p.images || []).map((img) => img.imageUrl))
  );
  const womenImageUrls = new Set(
    womenProducts.flatMap((p) => (p.images || []).map((img) => img.imageUrl))
  );
  const duplicatedImageUrls = [...menImageUrls].filter((url) => womenImageUrls.has(url));

  if (duplicatedNames.length > 0 || duplicatedImageUrls.length > 0) {
    throw new Error(
      `Seed validation failed. Duplicate names: ${duplicatedNames.length}, duplicate image URLs: ${duplicatedImageUrls.length}`
    );
  }
};

const runSeed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Missing MONGODB_URI in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    validateSeedData();

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

    console.log("Seeded 20 products: 10 for men and 10 for women.");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

runSeed();
