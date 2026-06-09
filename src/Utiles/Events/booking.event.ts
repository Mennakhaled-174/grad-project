import EventEmitter from "events";
import { sendEmail } from "../Email/sendEmail";
import { bookingTemplate } from "../Email/booking.template";

export const bookingEvents = new EventEmitter();

// 👇 type helper (optional but recommended)
type WorkerInfo = {
  fullName: string;
  phone: string;
  nationalId: string;
  document?: boolean;
};

type BookingEmailEvent = {
  to: string;

  fullname: string;
  phone: string;
  city: string;
  addressDetails: string;
  building: string;
  floor: string;
  apartment: string;

  date: Date;
  time: string;

  service: string;
  size: string;
  price: number;

  worker: WorkerInfo;
};

bookingEvents.on("sendBookingDetails", async (data: BookingEmailEvent) => {
  try {
    const html = bookingTemplate(data);

    await sendEmail({
      to: data.to,
      subject: "Booking Confirmation",
      html,
    });
  } catch (error) {
    console.log("fail to send booking email", error);
  }
});