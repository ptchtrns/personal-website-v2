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

export const handler = define.handlers({
  GET(ctx) {
    const params = new URL(ctx.req.url).searchParams;
    return {
      data: {
        error: params.get("error"),
        success: params.get("success") === "1",
      },
    };
  },
});

export default define.page<typeof handler>(function Contact({ data }) {
  return (
    <MainDisplay>
      <div class="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Contact me</CardTitle>
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
            </form>
          </CardContent>
        </Card>
      </div>
    </MainDisplay>
  );
});
