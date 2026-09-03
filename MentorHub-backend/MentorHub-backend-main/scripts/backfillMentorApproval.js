/**
 * One-off migration script.
 *
 * When we introduced `approvalStatus` on the User model, existing mentor
 * documents (created before this field existed) don't have it set at all -
 * they were live mentors before approval was a concept, so we mark them
 * "approved" here rather than making them disappear from the platform.
 *
 * New mentors signing up after this change already get approvalStatus set
 * correctly at creation time (see services/auth.service.js), so this only
 * needs to run once against existing data.
 *
 * Usage:
 *   node scripts/backfillMentorApproval.js
 */
const mongoose = require("mongoose");
const config = require("../config");
const UserModel = require("../models/user.model");

const run = async () => {
  await mongoose.connect(config.DB_URL);

  const result = await UserModel.updateMany(
    { role: "mentor", approvalStatus: { $exists: false } },
    { $set: { approvalStatus: "approved" } }
  );

  console.log(
    `Backfilled approvalStatus on ${result.modifiedCount} existing mentor(s).`
  );

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
