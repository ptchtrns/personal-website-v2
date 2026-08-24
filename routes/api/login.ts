import { define } from "@/utils.ts";
import { ADMIN_PASSWORD } from "@/lib/config.ts";
import { createToken, setAuthCookie } from "@/lib/auth.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const formData = await ctx.req.formData();
    const password = String(formData.get("password") ?? "");

    // An unset ADMIN_PASSWORD must never authenticate an empty password.
    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      return redirectTo(
        "/login?error=" + encodeURIComponent("Invalid credentials"),
      );
    }

    const response = redirectTo("/admin");
    setAuthCookie(response.headers, await createToken());
    return response;
  },
});
