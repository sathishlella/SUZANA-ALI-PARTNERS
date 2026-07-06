import nodemailer from "nodemailer";
import { firm } from "./firm-data";

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function htmlShell(title, body) {
  return `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.6;max-width:640px;margin:0 auto;padding:24px">
      <div style="border-bottom:1px solid #d8c59d;padding-bottom:16px;margin-bottom:20px">
        <div style="font-family:Georgia,serif;font-size:24px;color:#111827">${firm.name}</div>
        <div style="color:#6b7280">${firm.descriptor}</div>
      </div>
      <h1 style="font-size:22px;margin:0 0 16px">${title}</h1>
      ${body}
      <p style="color:#6b7280;font-size:13px;margin-top:28px">This appointment request was created through the Suzana Ali & Partners website concierge.</p>
    </div>
  `;
}

export async function sendBookingEmails(booking) {
  const recipient = booking.partnerEmail;
  const from = process.env.EMAIL_FROM || `Suzana Ali & Partners <${firm.klEmail}>`;
  const subject = `Consultation booked: ${booking.clientName} - ${booking.slotLabel}`;

  const clientHtml = htmlShell(
    "Consultation Request Received",
    `
      <p>Dear ${booking.clientName},</p>
      <p>Thank you. Your consultation request has been received for <strong>${booking.slotLabel}</strong> with <strong>${booking.partnerName}</strong>.</p>
      <p><strong>Matter:</strong> ${booking.matterType}<br />
      <strong>Reference:</strong> ${booking.id}</p>
      <p>Our team will review your information and confirm any documents required before the appointment.</p>
    `
  );

  const firmHtml = htmlShell(
    "New Consultation Booking",
    `
      <p><strong>Partner:</strong> ${booking.partnerName}</p>
      <p><strong>Slot:</strong> ${booking.slotLabel}</p>
      <p><strong>Client:</strong> ${booking.clientName}<br />
      <strong>Email:</strong> ${booking.clientEmail}<br />
      <strong>Phone:</strong> ${booking.clientPhone || "Not provided"}</p>
      <p><strong>Matter:</strong> ${booking.matterType}</p>
      <p><strong>Notes:</strong><br />${booking.notes || "No notes provided."}</p>
      <p><strong>Reference:</strong> ${booking.id}</p>
    `
  );

  if (!smtpConfigured()) {
    console.log("[booking-email:client]", { to: booking.clientEmail, subject });
    console.log("[booking-email:firm]", { to: recipient, subject, booking });
    return { sent: false, mode: "logged" };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from,
    to: booking.clientEmail,
    subject: `Consultation request received - ${booking.id}`,
    html: clientHtml
  });

  await transporter.sendMail({
    from,
    to: recipient,
    replyTo: booking.clientEmail,
    subject,
    html: firmHtml
  });

  return { sent: true, mode: "smtp" };
}
