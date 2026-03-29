import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { ApiError } from "./utils/ApiError.js";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 250),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.disable("x-powered-by");
app.set("trust proxy", Number(process.env.TRUST_PROXY || 0));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(globalLimiter);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients and same-origin requests with no origin header.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new ApiError(403, "CORS origin not allowed"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); //For handling form data (configuration)
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //For handling URL data (configuration)
app.use(express.static("public")); //For public assets (configuration)
app.use(cookieParser());

//imports
import userRoutes from "./routes/user/user.route.js";
import productRoutes from "./routes/product/product.route.js";
import cartRoutes from "./routes/cart/cart.routes.js";
import reviewRoutes from "./routes/review/review.routes.js"
import orderRoutes from "./routes/order/order.route.js"

//routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);

// Centralized error response handler.
app.use((err, req, res, next) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err?.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err?.errors || [],
  });
});

export { app };
