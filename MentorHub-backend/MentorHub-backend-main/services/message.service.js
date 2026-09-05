const razorpay = require("razorpay");
const config = require("../config");
const httpStatus = require("../util/httpStatus");
const bookingService = require("../services/booking.service");
const zoomService = require("../services/zoom.service");
const emailService = require("../services/email.service");
const notificationService = require("../services/notification.service");
const moment = require("moment");

const handleRazorpayWebhook = async (req, res, next) => {
  const { event } = req.body;
  if (event === "order.paid") {
    const bookingId = req.body.payload.payment.entity.notes.bookingId;

    const booking = await bookingService.getBookingById(bookingId);

    const zoomMeeting = await zoomService.createScheduledZoomMeeting(
      booking.dateAndTime,
      booking.service.duration
    );

    await bookingService.updateBookingById(bookingId, {
  meetingLink: zoomMeeting.joinUrl,
  startUrl: zoomMeeting.startUrl,
  status: "confirmed",
});

await emailService.sendConfirmationMail(
  booking.user.email,
  booking.user.name,
  zoomMeeting.joinUrl,
  moment(booking.dateAndTime).format("DD-MM-YYYY"),
  moment(booking.dateAndTime).format("HH:mm")
);

const sessionTime = moment(booking.dateAndTime).format("DD MMM, hh:mm A");

await notificationService.createNotification({
  userId: booking.user._id,
  type: "booking_confirmed",
  message: `Your session on ${sessionTime} is confirmed`,
  link: "/user-bookings",
});

await notificationService.createNotification({
  userId: booking.mentor,
  type: "booking_confirmed",
  message: `A session on ${sessionTime} was confirmed`,
  link: "/dashboard/bookings",
});
  }
  return res.status(httpStatus.ok).json({
    message: "Webhook received",
  });
};

module.exports = {
  handleRazorpayWebhook,
};
