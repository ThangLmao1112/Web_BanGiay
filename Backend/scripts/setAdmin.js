import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/user/user.model.js";
import { Auth } from "../src/models/user/auth.model.js";
import { Contact } from "../src/models/user/contact.model.js";

dotenv.config({
  path: "./.env",
});

const ADMIN_USER = {
  firstName: "Admin",
  lastName: "User",
  email: "thangdemo01@gmail.com",
  gender: "Male",
  phone: "03000001234",
  password: "12345678",
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    let user = await User.findOne({ email: ADMIN_USER.email }).populate("auth contact");

    if (!user) {
      const auth = await Auth.create({ password: ADMIN_USER.password });
      const contact = await Contact.create({ phone: ADMIN_USER.phone });

      await User.create({
        firstName: ADMIN_USER.firstName,
        lastName: ADMIN_USER.lastName,
        email: ADMIN_USER.email,
        gender: ADMIN_USER.gender,
        auth: auth._id,
        contact: contact._id,
        role: "admin",
      });

      console.log("Created new admin account successfully.");
    } else {
      user.firstName = ADMIN_USER.firstName;
      user.lastName = ADMIN_USER.lastName;
      user.gender = ADMIN_USER.gender;
      user.role = "admin";
      await user.save();

      if (user.contact) {
        user.contact.phone = ADMIN_USER.phone;
        await user.contact.save();
      }

      if (user.auth) {
        user.auth.password = ADMIN_USER.password;
        await user.auth.save();
      }

      console.log("Updated existing admin account successfully.");
    }

    console.log("Admin account ready:");
    console.log(`Email: ${ADMIN_USER.email}`);
    console.log(`Password: ${ADMIN_USER.password}`);
    await mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err);
    process.exitCode = 1;
  }
};

run();
