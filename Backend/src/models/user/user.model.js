import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
    },
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
    preferences: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserPreferences",
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    activityScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAccessToken = function () {
  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
  const accessTokenExpiry =
    process.env.ACCESS_TOKEN_EXPIRY || process.env.JWT_EXPIRY || "1d";

  if (!accessTokenSecret) {
    throw new Error("Missing ACCESS_TOKEN_SECRET or JWT_SECRET in environment");
  }

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
    },
    accessTokenSecret,
    {
      expiresIn: accessTokenExpiry,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  const refreshTokenSecret =
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
  const refreshTokenExpiry =
    process.env.REFRESH_TOKEN_EXPIRY || process.env.JWT_EXPIRY || "7d";

  if (!refreshTokenSecret) {
    throw new Error("Missing REFRESH_TOKEN_SECRET or JWT_SECRET in environment");
  }

  return jwt.sign(
    {
      _id: this._id,
    },
    refreshTokenSecret,
    {
      expiresIn: refreshTokenExpiry,
    }
  );
};
userSchema.plugin(aggregatePaginate);

export const User = mongoose.model("User", userSchema);
