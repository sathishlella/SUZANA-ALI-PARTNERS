import { NextResponse } from "next/server";
import {
  availabilityForOffice,
  getOffice,
  makeBookingId,
  officeEmail,
  publicBooking,
  writeBooking
} from "@/lib/booking";
import { sendBookingEmails } from "@/lib/email";

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function invalid(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return invalid("Invalid booking request.");

  const office = getOffice(clean(body.officeId));
  const slotId = clean(body.slotId);
  const matterType = clean(body.matterType);
  const clientName = clean(body.clientName);
  const clientEmail = clean(body.clientEmail);
  const clientPhone = clean(body.clientPhone);
  const notes = clean(body.notes);

  if (!matterType || !clientName || !clientEmail || !slotId) {
    return invalid("Please provide a matter type, appointment slot, name and email.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
    return invalid("Please provide a valid email address.");
  }

  const slots = await availabilityForOffice(office.id);
  const slot = slots.find((candidate) => candidate.id === slotId);
  if (!slot) {
    return invalid("That appointment slot is no longer available.", 409);
  }

  const booking = {
    id: makeBookingId(),
    createdAt: new Date().toISOString(),
    officeId: office.id,
    officeLabel: office.label,
    officeEmail: officeEmail(office),
    slotId,
    slotDate: slot.date,
    slotTime: slot.time,
    slotLabel: slot.label,
    timezone: slot.timezone,
    matterType,
    clientName,
    clientEmail,
    clientPhone,
    notes,
    source: "website-concierge"
  };

  await writeBooking(booking);
  const email = await sendBookingEmails(booking);

  return NextResponse.json({
    booking: publicBooking(booking),
    email
  });
}
