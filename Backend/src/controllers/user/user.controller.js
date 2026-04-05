import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user/user.model.js";
import { Auth } from "../../models/user/auth.model.js";
import { Address } from "../../models/user/address.model.js";
import { Contact } from "../../models/user/contact.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const updateActivityScoreOnLogin = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $inc: { activityScore: 10 }, // Increment score by 10 for login
    });
  } catch (error) {
    console.error("Error updating activity score on login:", error);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    gender,
    phone,
    password,
    address = [],
  } = req.body;
  if ((!firstName, !lastName, !email, !gender, !phone, !password)) {
    throw new ApiError(401, "Fill all the fields");
  }
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(400, "Email already exists");
  }
  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    throw new ApiError(400, "Phone number already exists");
  }
  const auth = new Auth({
    password,
  });
  await auth.save();
  const addressIds = await Promise.all(
    address.map(async (addr) => {
      const newAddress = new Address(addr);
      await newAddress.save();
      return newAddress._id;
    })
  );
  const newContact = new Contact({ phone });
  await newContact.save();
  const createUser = await User.create({
    firstName,
    lastName,
    email,
    gender,
    addresses: addressIds,
    contact: newContact._id,
    auth: auth._id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, createUser, "User Created successfuly"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({ email }).populate("auth");
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isPasswordValid = await user.auth.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password.");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id)
    .select("-auth.password -refreshToken -auth")
    .populate({
      path: "auth",
      select: "-password",
    })
    .lean();

  if (!loggedInUser) {
    throw new ApiError(500, "Error fetching user details.");
  }

  delete loggedInUser.auth;

  await updateActivityScoreOnLogin(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  return res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully."
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  let decodedToken;
  try {
    const refreshTokenSecret =
      process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
    
    if (!refreshTokenSecret) {
      throw new ApiError(500, "Missing REFRESH_TOKEN_SECRET or JWT_SECRET in environment");
    }
    
    decodedToken = jwt.verify(
      incomingRefreshToken,
      refreshTokenSecret
    );
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(decodedToken?._id);
  if (!user || !user.refreshToken) {
    throw new ApiError(401, "Refresh token is invalid or expired");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token mismatch");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  return res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed successfully"
      )
    );
});
const getUserFirstName = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user.firstName, "User First Name fetched"));
});
const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Details fetched"));
});

const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id)
    .select("firstName lastName email gender role createdAt updatedAt contact")
    .populate({ path: "contact", select: "phone" })
    .lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile fetched successfully"));
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, gender, phone } = req.body;

  const hasDataToUpdate =
    firstName !== undefined ||
    lastName !== undefined ||
    gender !== undefined ||
    phone !== undefined;

  if (!hasDataToUpdate) {
    throw new ApiError(400, "Please provide at least one field to update");
  }

  const user = await User.findById(req.user?._id).populate("contact");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (firstName !== undefined) {
    user.firstName = firstName;
  }

  if (lastName !== undefined) {
    user.lastName = lastName;
  }

  if (gender !== undefined) {
    user.gender = gender;
  }

  await user.save();

  if (phone !== undefined) {
    if (user.contact) {
      user.contact.phone = phone;
      await user.contact.save();
    } else {
      const createdContact = await Contact.create({ phone });
      user.contact = createdContact._id;
      await user.save();
    }
  }

  const updatedUser = await User.findById(user._id)
    .select("firstName lastName email gender role createdAt updatedAt contact")
    .populate({ path: "contact", select: "phone" })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

const changeMyPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new ApiError(400, "Please provide old, new and confirm password");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New password and confirm password must match");
  }

  if (newPassword.length < 8) {
    throw new ApiError(400, "New password must be at least 8 characters");
  }

  const user = await User.findById(req.user?._id).populate("auth");
  if (!user || !user.auth) {
    throw new ApiError(404, "User auth not found");
  }

  const isOldPasswordValid = await user.auth.isPasswordCorrect(oldPassword);
  if (!isOldPasswordValid) {
    throw new ApiError(401, "Old password is incorrect");
  }

  user.auth.password = newPassword;
  await user.auth.save();

  await User.findByIdAndUpdate(user._id, {
    $set: {
      refreshToken: undefined,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});
const getAllUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;

  const aggregationPipeline = [
    {
      $lookup: {
        from: "contacts",
        localField: "contact",
        foreignField: "_id",
        as: "userContactDetails",
      },
    },
    {
      $unwind: {
        path: "$userContactDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        firstName: { $first: "$firstName" },
        lastName: { $first: "$lastName" },
        email: { $first: "$email" },
        gender: { $first: "$gender" },
        contactInfo: { $first: "$userContactDetails.phone" },
        registeredDate: { $first: "$createdAt" },
        activityScore: { $first: "$activityScore" },
        updatedDate: { $first: "$updatedAt" },
      },
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        gender: 1,
        contactInfo: 1,
        registeredDate: 1,
        activityScore: 1,
        updatedDate: 1,
      },
    },
  ];

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { [sortBy]: sortType === "desc" ? -1 : 1 },
  };

  const allUsers = await User.aggregatePaginate(
    User.aggregate(aggregationPipeline),
    options
  );

  if (!allUsers.docs || allUsers.docs.length === 0) {
    throw new ApiError(404, "No users found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { allUsers: allUsers.docs, totalUsers: allUsers.totalDocs },
        "All users are fetched"
      )
    );
});
const removeUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log(userId);

  if (!userId) {
    throw new ApiError(
      400,
      "User Id is required to proceed to delete the user"
    );
  }
  const deleteUser = await User.findByIdAndDelete(userId);
  if (!deleteUser) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, deleteUser, "The user deleted successfuly"));
});
const getMostActiveUsers = asyncHandler(async (req, res) => {
  const mostActiveUsers = await User.find({})
    .sort({ activityScore: -1 })
    .limit(10);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { data: mostActiveUsers },
        "Most active user fetched"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getUserFirstName,
  getUserDetails,
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  getAllUsers,
  removeUser,
  getMostActiveUsers,
};
