import { Resend } from "resend";
import { z } from "zod";
import { define } from "@/utils.ts";
import { CONTACT_TO_EMAIL, RESEND_API_KEY } from "@/lib/config.ts";
import { redirectTo } from "@/lib/http.ts";
import { requiredTrimmedString } from "@/lib/validation.ts";

const ContactFormSchema = z.object({
  name: requiredTrimmedString("Name is required"),
  email: requiredTrimmedString("Email is required").pipe(
    z.string().email("Enter a valid email address"),
  ),
  subject: requiredTrimmedString("Subject is required"),
  message: requiredTrimmedString("Message is required"),
});

export const handler = define.handlers({
  async POST(ctx) {
    const formData = await ctx.req.formData();
    const parsed = ContactFormSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    });

    if (!parsed.success) {
      return redirectTo(
        "/contact?error=" +
          encodeURIComponent(
            parsed.error.issues[0]?.message ?? "All fields are required",
          ),
      );
    }
    const { name, email, subject, message } = parsed.data;

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
