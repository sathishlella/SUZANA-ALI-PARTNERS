import fs from "node:fs/promises";
import path from "node:path";
import { firm } from "./firm-data";

const bookingFile = path.join(process.cwd(), "data", "bookings.json");
const timeZone = "Asia/Kuala_Lumpur";

export function getOffice(officeId) {
  return firm.offices.find((office) => office.id === officeId) || firm.offices[0];
}

export function officeEmail(office) {
  return process.env[office.emailEnv] || process.env.SUZANA_EMAIL || "admin.kl@suzanaali.com";
}

export async function readBookings() {
  try {
    const file = await fs.readFile(bookingFile, "utf8");
    return JSON.parse(file);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

export async function writeBooking(booking) {
  await fs.mkdir(path.dirname(bookingFile), { recursive: true });
  const bookings = await readBookings();
  bookings.push(booking);
  await fs.writeFile(bookingFile, `${JSON.stringify(bookings, null, 2)}\n`);
  return booking;
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function weekdayLabel(date) {
  return new Intl.DateTimeFormat("en-MY", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone
  }).format(date);
}

export async function availabilityForOffice(officeId) {
  const booked = new Set(
    (await readBookings())
      .filter((booking) => booking.officeId === officeId)
      .map((booking) => booking.slotId)
  );

  const slots = [];
  const now = new Date();
  const officeTimes = ["09:30", "11:00", "14:30", "16:00"];

  for (let offset = 1; slots.length < 12 && offset < 21; offset += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + offset);

    const day = date.getDay();
    if (day === 0 || day === 6) continue;

    const dateKey = formatDateKey(date);
    for (const time of officeTimes) {
      const slotId = `${officeId}:${dateKey}:${time}`;
      if (booked.has(slotId)) continue;
      slots.push({
        id: slotId,
        date: dateKey,
        time,
        label: `${weekdayLabel(date)}, ${time}`,
        timezone: "Malaysia Time"
      });
      if (slots.length >= 12) break;
    }
  }

  return slots;
}

export function makeBookingId() {
  return `SAP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function publicBooking(booking) {
  return {
    id: booking.id,
    officeLabel: booking.officeLabel,
    slotLabel: booking.slotLabel,
    clientName: booking.clientName,
    clientEmail: booking.clientEmail,
    matterType: booking.matterType
  };
}
