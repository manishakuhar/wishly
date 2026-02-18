import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Wishly <onboarding@resend.dev>";

export async function sendGiftClaimedEmail({
  hostEmail,
  hostName,
  giftName,
  claimerName,
  eventTitle,
  dashboardUrl,
  message,
}: {
  hostEmail: string;
  hostName: string;
  giftName: string;
  claimerName: string;
  eventTitle: string;
  dashboardUrl: string;
  message?: string | null;
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: hostEmail,
      subject: `Someone claimed ${giftName} from your Wishly!`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #7C3AED;">Hey ${hostName}!</h2>
          <p>Great news! <strong>${giftName}</strong> has been claimed from your <strong>${eventTitle}</strong> registry.</p>
          <p><strong>${claimerName}</strong> is getting this for you!</p>
          ${message ? `<p style="color: #6B7280; font-style: italic;">They left a note: "${message}"</p>` : ""}
          <a href="${dashboardUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #7C3AED; color: white; text-decoration: none; border-radius: 8px;">View your dashboard</a>
          <p style="margin-top: 24px; color: #9CA3AF; font-size: 12px;">Sent by Wishly</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send gift claimed email:", error);
  }
}

export async function sendClaimConfirmationEmail({
  guestEmail,
  guestName,
  giftName,
  eventTitle,
  giftLink,
}: {
  guestEmail: string;
  guestName: string;
  giftName: string;
  eventTitle: string;
  giftLink?: string | null;
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: guestEmail,
      subject: `You claimed ${giftName} for ${eventTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #7C3AED;">Hi ${guestName}!</h2>
          <p>You've committed to getting <strong>${giftName}</strong> for <strong>${eventTitle}</strong>.</p>
          ${giftLink ? `<p><a href="${giftLink}" style="color: #7C3AED;">View the product</a></p>` : ""}
          <p style="margin-top: 24px; color: #9CA3AF; font-size: 12px;">Sent by Wishly</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send claim confirmation email:", error);
  }
}
