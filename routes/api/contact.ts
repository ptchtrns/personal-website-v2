import { Resend } from "resend";
import { define } from "@/utils.ts";
import { CONTACT_TO_EMAIL, RESEND_API_KEY } from "@/lib/config.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const formData = await ctx.req.formData();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !subject || !message) {
      return redirectTo(
        "/contact?error=" + encodeURIComponent("All fields are required"),
      );
    }

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return redirectTo(
        "/contact?error=" +
          encodeURIComponent("Message could not be sent, try again later"),
      );
    }

    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return redirectTo(
        "/contact?error=" +
          encodeURIComponent("Message could not be sent, try again later"),
      );
    }

    return redirectTo("/contact?success=1");
  },
});

/** Contact form fields are interpolated into the email HTML, so they must be escaped to prevent HTML injection. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
