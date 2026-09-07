const { Schema, model } = require("mongoose");

const timeSlot = {
  startTime: { type: String },
  endTime: { type: String },
};

const availabilitySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weeklyAvailability: {
      monday: [timeSlot],
      tuesday: [timeSlot],
      wednesday: [timeSlot],
      thursday: [timeSlot],
      friday: [timeSlot],
      saturday: [timeSlot],
      sunday: [timeSlot],
    },
    // NEW: one-off overrides for a single calendar date (format: "YYYY-MM-DD").
    // If a date has an entry here, it takes priority over weeklyAvailability
    // for that exact date only - it does NOT repeat on future weeks.
    specificAvailability: [
      {
        date: { type: String, required: true }, // "YYYY-MM-DD"
        slots: [timeSlot],
      },
    ],
    unavailableDates: [
      {
        type: Date,
      },
    ],
  },
  { timestamps: true }
);

const AvailabilityModel = model("Availability", availabilitySchema);
module.exports = AvailabilityModel;