import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/user/user.model.js";
import { Auth } from "../src/models/user/auth.model.js";
import { Contact } from "../src/models/user/contact.model.js";

dotenv.config({ path: "./.env" });

const TEST_USER = {
  firstName: "Test",
  lastName: "User",
  email: "user.test.shoeshop@gmail.com",
  gender: "Male",
  phone: "03000001234",
  password: "User@12345",
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    let user = await User.findOne({ email: TEST_USER.email }).populate("auth contact");

    if (!user) {
      const auth = await Auth.create({ password: TEST_USER.password });
      const contact = await Contact.create({ phone: TEST_USER.phone });

      user = await User.create({
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName,
        email: TEST_USER.email,
        gender: TEST_USER.gender,
        auth: auth._id,
        contact: contact._id,
        role: "user",
      });

      console.log("Created new test user successfully.");
    } else {
      user.firstName = TEST_USER.firstName;
      user.lastName = TEST_USER.lastName;
      user.gender = TEST_USER.gender;
      user.role = "user";
      await user.save();

      if (user.contact) {
        user.contact.phone = TEST_USER.phone;
        await user.contact.save();
      }

      if (user.auth) {
        user.auth.password = TEST_USER.password;
        await user.auth.save();
      }

      console.log("Updated existing test user successfully.");
    }

    console.log("Test account ready:");
    console.log(`Email: ${TEST_USER.email}`);
    console.log(`Password: ${TEST_USER.password}`);
  } catch (error) {
    console.error("Failed to create test user:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
