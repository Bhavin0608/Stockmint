import cron from "node-cron";
import { expireReservations } from "../services/reservation.service.js";

export const startReservationExpiryJob = () => {
    // here evert minute the cron job will run and check for expired reservations and release them
    // and each star mean minute, hour, day of month, month, day of week. so * * * * * means every minute of every hour of every day of every month and every day of the week.
  cron.schedule("* * * * *", async () => {
    try {
      const expiredCount = await expireReservations();

      if (expiredCount > 0) {
        console.log(
          `Expired ${expiredCount} reservation(s)`
        );
      }
    } catch (error) {
      console.error(
        "Reservation expiry job failed:",
        error
      );
    }
  });
};