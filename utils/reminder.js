import Room from "../models/Room.js";
import Payment from "../models/Payment.js";
import { sendEmail } from "./email.js";

export const sendPaymentReminders = async () => {
  try {
    // Fetch rooms with tenants
    const rooms = await Room.find({
      "tenant.userId": { $exists: true },
    }).populate("tenant.userId");

    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    for (const room of rooms) {
      // Check if payment exists for this month
      const lastPayment = await Payment.findOne({
        roomId: room._id,
        month: currentMonth,
      });

      if (!lastPayment) {
        // Send email reminder
        await sendEmail({
          to: room.tenant.email,
          subject: `Rent Reminder for Room ${room.roomNumber}`,
          text: `Dear ${room.tenant.name},\n\nYour rent for ${currentMonth} is pending. Please pay on time.\n\nThank you.`,
        });

        console.log(`Reminder sent to ${room.tenant.email}`);
      }
    }
  } catch (err) {
    console.error("Payment reminder error:", err);
  }
};
