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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";

export const handler = define.handlers({
  GET(ctx) {
    // Already signed in, no reason to show the form again.
    if (ctx.state.isAdmin) return ctx.redirect("/admin");

    const error = new URL(ctx.req.url).searchParams.get("error");
    return { data: { error } };
  },
});

export default define.page<typeof handler>(function Login({ data }) {
  return (
    <MainDisplay>
      <div class="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form method="POST" action="/api/login" class="flex flex-col gap-3">
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel for="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      required
                    />
                    {data.error && <FieldError>{data.error}</FieldError>}
                  </Field>
                </FieldGroup>
              </FieldSet>

              <Button type="submit" class="w-full" variant="ghost">
                Log in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainDisplay>
  );
});
