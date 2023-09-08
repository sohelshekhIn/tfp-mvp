import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLocalTimeString = () => {
  // Get the current local date and time
  const localDate = new Date();
  // Get the local time zone offset in minutes
  const timeZoneOffsetMinutes = localDate.getTimezoneOffset();

  // Calculate the local time zone offset in hours and minutes
  const timeZoneOffsetHours = Math.abs(Math.floor(timeZoneOffsetMinutes / 60));
  const timeZoneOffsetMinutesRemainder = Math.abs(timeZoneOffsetMinutes % 60);

  // Determine the sign of the time zone offset (positive or negative)
  const timeZoneOffsetSign = timeZoneOffsetMinutes < 0 ? "+" : "-";

  // Create a custom ISO-like string with the local date, time, and time zone offset
  return `${localDate.getFullYear()}-${String(
    localDate.getMonth() + 1
  ).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}T${String(
    localDate.getHours()
  ).padStart(2, "0")}:${String(localDate.getMinutes()).padStart(
    2,
    "0"
  )}:${String(localDate.getSeconds()).padStart(2, "0")}.${String(
    localDate.getMilliseconds()
  ).padStart(3, "0")}${timeZoneOffsetSign}${String(
    timeZoneOffsetHours
  ).padStart(2, "0")}:${String(timeZoneOffsetMinutesRemainder).padStart(
    2,
    "0"
  )}`;
};
