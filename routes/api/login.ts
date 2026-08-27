import { z } from "zod";
import { define } from "@/utils.ts";
import { getConfig } from "@/lib/config.ts";
import { createToken, setAuthCookie } from "@/lib/auth.ts";
import { redirectTo } from "@/lib/http.ts";

const LoginFormSchema = z.object({
  password: z.preprocess(
    (v) => (v == null ? "" : String(v)),
    z.string().min(1, "Invalid credentials"),
  ),
});

export const handler = define.handlers({
  async POST(ctx) {
    const formData = await ctx.req.formData();
    const parsed = LoginFormSchema.safeParse({
      password: formData.get("password"),
    });
    if (!parsed.success) {
      return redirectTo(
        "/login?error=" + encodeURIComponent("Invalid credentials"),
      );
    }
    const { password } = parsed.data;

    // An unset ADMIN_PASSWORD must never authenticate an empty password.
    const { ADMIN_PASSWORD } = await getConfig();
    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      return redirectTo(
        "/login?error=" + encodeURIComponent("Invalid credentials"),
      );
    }

    const response = redirectTo("/admin");
    await setAuthCookie(response.headers, await createToken());
    return response;
  },
});
