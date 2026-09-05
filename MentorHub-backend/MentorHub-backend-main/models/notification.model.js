const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      // the recipient
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "booking_created",
        "booking_confirmed",
        "new_message",
        "mentor_approved",
        "mentor_rejected",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      // where the frontend should navigate to when this is clicked
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const NotificationModel = mongoose.model("Notification", notificationSchema);

module.exports = NotificationModel;
