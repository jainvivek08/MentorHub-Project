/**
 * One-off script to create an admin account.
 * Public signup deliberately blocks role: "admin", so use this instead.
 *
 * Usage:
 *   node scripts/createAdmin.js "Admin Name" admin@example.com "StrongPassword123" adminuser
 */
const mongoose = require("mongoose");
const config = require("../config");
const UserModel = require("../models/user.model");

const run = async () => {
  const [name, email, password, username] = process.argv.slice(2);

  if (!name || !email || !password || !username) {
    console.error(
      "Usage: node scripts/createAdmin.js <name> <email> <password> <username>"
    );
    process.exit(1);
  }

  await mongoose.connect(config.DB_URL);

  const existing = await UserModel.findOne({ email });
  if (existing) {
    console.error(`A user with email ${email} already exists.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const admin = await UserModel.create({
    name,
    email,
    password,
    username,
    role: "admin",
    approvalStatus: "approved",
  });

  console.log(`Admin account created: ${admin.email} (${admin._id})`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
