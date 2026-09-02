import { define } from "../utils.ts";
import { MainDisplay } from "@/components/layout/MainDisplay.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { getSiteSetting } from "@/lib/site-settings.ts";
import { markdownToHtml } from "@/lib/markdown.ts";

const DEFAULT_CONTACT_INFO =
  "I'm open to freelance work, collaborations and full-time opportunities. " +
  "Reach out with your project details and I'll get back to you with rates and availability.";

export const handler = define.handlers({
  async GET(ctx) {
    const params = new URL(ctx.req.url).searchParams;
    const contactInfo = await getSiteSetting("contact_info");
    return {
      data: {
        error: params.get("error"),
        success: params.get("success") === "1",
        contactInfoHtml: markdownToHtml(contactInfo ?? DEFAULT_CONTACT_INFO)!,
      },
    };
  },
});

export default define.page<typeof handler>(function Contact({ data }) {
  return (
    <MainDisplay>
      <div class="flex flex-col gap-8 w-full">
        <section class="flex flex-col gap-3">
          <h1 class="text-4xl font-bold dark:text-zinc-100">Contact me</h1>
          <div
            class="markdown-content text-lg leading-relaxed text-zinc-700 dark:text-zinc-300"
            // deno-lint-ignore react-no-danger -- admin-authored markdown, rendered server-side
            dangerouslySetInnerHTML={{ __html: data.contactInfoHtml }}
          />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Send a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              method="POST"
              action="/api/contact"
              class="flex flex-col gap-3"
            >
              <FieldSet>
                {data.success && (
                  <FieldDescription>
                    Message sent, thanks! I'll get back to you soon.
                  </FieldDescription>
                )}
                <FieldGroup>
                  <Field>
                    <FieldLabel for="name">Name</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Your name"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel for="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel for="subject">Subject</FieldLabel>
                    <Input
                      id="subject"
                      type="text"
                      name="subject"
                      placeholder="What's this about?"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel for="message">Message</FieldLabel>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message"
                      rows={5}
                      required
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              {data.error && <FieldError>{data.error}</FieldError>}

              <Button type="submit" class="w-full" variant="default">
                Send message
              </Button>

              <p class="text-sm text-zinc-500 dark:text-zinc-400">
                Your info will only be used to reply to you.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainDisplay>
  );
});
