import EventEmitter from "events";
import { otpEnum } from "../../common/Types/types";
import { template } from "../Email/verifyEmail.template";
import {sendEmail} from "../Email/sendEmail";

export const emailEvents = new EventEmitter();
emailEvents.on("changePassword", async (data) => {
  try {
    data.subject = otpEnum.changePassword;
    data.html = template(data.otp, data.firstName, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.log("fail to send email", error);
  }
});