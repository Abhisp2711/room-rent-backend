import cron from "node-cron";
import { sendPaymentReminders } from "./reminder.js";

export const startPaymentReminderCron = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("Running daily rent reminder job...");
    await sendPaymentReminders();
  });
};
