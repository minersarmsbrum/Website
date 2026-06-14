import { Resend } from "resend";
import type { Booking } from "@/lib/store";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const EMAIL_FROM = process.env.EMAIL_FROM ?? "bookings@theminersarms.co.uk";
const EMAIL_TO_ADMIN = process.env.EMAIL_TO_ADMIN ?? "";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_ADMIN_BOT_TOKEN ?? "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID ?? "";
const TELEGRAM_STAFF_BOT_TOKEN = process.env.TELEGRAM_STAFF_BOT_TOKEN ?? "";
const TELEGRAM_STAFF_CHAT_ID = process.env.TELEGRAM_STAFF_CHAT_ID ?? "";

// ─── Primitives ───────────────────────────────────────────────────────────────

async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.warn("[notifications] RESEND_API_KEY not set — email skipped");
    return;
  }
  try {
    await resend.emails.send({ from: EMAIL_FROM, to, subject, html });
  } catch (err) {
    console.error("[notifications] Email send failed:", err);
  }
}

async function sendTelegram(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("[notifications] Admin Telegram env vars not set — Telegram skipped");
    return;
  }
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "HTML" }),
    });
  } catch (err) {
    console.error("[notifications] Admin Telegram send failed:", err);
  }
}

async function sendStaffTelegram(message: string) {
  if (!TELEGRAM_STAFF_BOT_TOKEN || !TELEGRAM_STAFF_CHAT_ID) {
    console.warn("[notifications] Staff Telegram env vars not set — Telegram skipped");
    return;
  }
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_STAFF_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_STAFF_CHAT_ID, text: message, parse_mode: "HTML" }),
    });
  } catch (err) {
    console.error("[notifications] Staff Telegram send failed:", err);
  }
}

// ─── Booking: new request ─────────────────────────────────────────────────────

export async function notifyNewBooking(booking: Booking) {
  const formattedDate = new Date(booking.date).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  // Email → guest
  await sendEmail(
    booking.email,
    "Booking request received – The Miners Arms",
    `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
      <h2 style="color:#c9921a">The Miners Arms</h2>
      <p>Hi ${booking.name.split(" ")[0]},</p>
      <p>Thanks for your reservation request. We've got your details and will confirm your table by phone or email shortly.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0">
        <tr><td style="padding:8px 0;color:#555;width:120px">Date</td><td style="padding:8px 0"><strong>${formattedDate}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#555">Time</td><td style="padding:8px 0"><strong>${booking.time}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#555">Guests</td><td style="padding:8px 0"><strong>${booking.guests}</strong></td></tr>
        ${booking.notes ? `<tr><td style="padding:8px 0;color:#555">Notes</td><td style="padding:8px 0">${booking.notes}</td></tr>` : ""}
      </table>
      <p style="color:#555;font-size:14px">If you need to make any changes, call us or reply to this email.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
      <p style="color:#999;font-size:12px">The Miners Arms · West Bromwich</p>
    </div>
    `
  );

  // Telegram → admin
  const notes = booking.notes ? `\n📝 <i>${booking.notes}</i>` : "";
  await sendTelegram(
    `🍽 <b>New Booking Request</b>\n\n` +
    `👤 ${booking.name}\n` +
    `📅 ${formattedDate} at ${booking.time}\n` +
    `👥 ${booking.guests} guest${booking.guests > 1 ? "s" : ""}\n` +
    `📞 ${booking.phone}\n` +
    `📧 ${booking.email}` +
    notes
  );
}

// ─── Booking: status change ───────────────────────────────────────────────────

export async function notifyBookingStatusChange(booking: Booking) {
  const formattedDate = new Date(booking.date).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  if (booking.status === "confirmed") {
    await sendEmail(
      booking.email,
      "Your table is confirmed – The Miners Arms",
      `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <h2 style="color:#c9921a">The Miners Arms</h2>
        <p>Hi ${booking.name.split(" ")[0]},</p>
        <p>Great news! Your table is <strong>confirmed</strong>. We're looking forward to seeing you.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <tr><td style="padding:8px 0;color:#555;width:120px">Date</td><td style="padding:8px 0"><strong>${formattedDate}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#555">Time</td><td style="padding:8px 0"><strong>${booking.time}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#555">Guests</td><td style="padding:8px 0"><strong>${booking.guests}</strong></td></tr>
        </table>
        <p style="color:#555;font-size:14px">If your plans change, please let us know as soon as possible.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="color:#999;font-size:12px">The Miners Arms · West Bromwich</p>
      </div>
      `
    );
  }

  if (booking.status === "cancelled") {
    await sendEmail(
      booking.email,
      "Booking update – The Miners Arms",
      `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <h2 style="color:#c9921a">The Miners Arms</h2>
        <p>Hi ${booking.name.split(" ")[0]},</p>
        <p>Unfortunately we've had to cancel your reservation for <strong>${formattedDate} at ${booking.time}</strong>.</p>
        <p>We're sorry for any inconvenience. We'd love to welcome you another time. Visit our website to make a new booking.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="color:#999;font-size:12px">The Miners Arms · West Bromwich</p>
      </div>
      `
    );
  }
}

// ─── Staff daily booking summary ─────────────────────────────────────────────

export async function notifyDailyBookingSummary(bookings: Booking[]) {
  const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const todayConfirmed = bookings
    .filter((b) => b.date === todayStr && b.status === "confirmed")
    .sort((a, b) => a.time.localeCompare(b.time));

  const todayPending = bookings.filter((b) => b.date === todayStr && b.status === "pending");

  const formattedDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  let lines = `📅 <b>Bookings for Today: ${formattedDate}</b>\n\n`;

  if (todayConfirmed.length === 0 && todayPending.length === 0) {
    lines += `No bookings today.`;
  } else {
    lines += `✅ <b>${todayConfirmed.length} confirmed</b>`;
    if (todayPending.length > 0) lines += ` · ⏳ <b>${todayPending.length} pending</b>`;
    lines += `\n`;

    if (todayConfirmed.length > 0) {
      lines += `\n`;
      for (const b of todayConfirmed) {
        const notes = b.notes ? `, <i>${b.notes}</i>` : "";
        lines += `⏰ ${b.time} · <b>${b.name}</b> · ${b.guests} guest${b.guests > 1 ? "s" : ""}${notes}\n`;
      }
    }

    if (todayPending.length > 0) {
      lines += `\n⚠️ ${todayPending.length} booking${todayPending.length > 1 ? "s" : ""} still need confirming. Check the portal.`;
    }
  }

  await sendStaffTelegram(lines);
}

// ─── Contact form ─────────────────────────────────────────────────────────────

export async function notifyContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  // Email → admin
  if (EMAIL_TO_ADMIN) {
    await sendEmail(
      EMAIL_TO_ADMIN,
      `New contact message: ${data.subject} – The Miners Arms`,
      `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <h2 style="color:#c9921a">New Contact Form Message</h2>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <tr><td style="padding:8px 0;color:#555;width:80px">From</td><td style="padding:8px 0"><strong>${data.name}</strong> (${data.email})</td></tr>
          <tr><td style="padding:8px 0;color:#555">Subject</td><td style="padding:8px 0">${data.subject}</td></tr>
        </table>
        <p style="background:#f5f5f5;padding:16px;border-radius:6px;white-space:pre-wrap">${data.message}</p>
        <p style="color:#999;font-size:12px">The Miners Arms · West Bromwich</p>
      </div>
      `
    );
  }

  // Telegram → admin
  await sendTelegram(
    `📬 <b>New Contact Form Message</b>\n\n` +
    `👤 <b>${data.name}</b> (${data.email})\n` +
    `📋 ${data.subject}\n\n` +
    `💬 <i>${data.message}</i>`
  );
}
