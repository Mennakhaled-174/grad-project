import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "isValidBookingTime", async: false })
export class IsValidBookingTime
  implements ValidatorConstraintInterface
{
  validate(value: string) {

    const [time, modifier] = value.split(" ");

    if (!time || !modifier) return false;

    let [hours, minutes] = time.split(":").map(Number);

    if (modifier.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    }

    if (modifier.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    const totalMinutes = hours * 60 + minutes;

    const start = 7 * 60;
    const end = 14 * 60;

    return totalMinutes >= start && totalMinutes <= end;
  }

  defaultMessage(args: ValidationArguments) {
    return "Booking time must be between 7 AM and 2 PM";
  }
}