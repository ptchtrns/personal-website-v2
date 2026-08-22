import { define } from "@/utils.ts";
import { ADMIN_PASSWORD } from "@/lib/config.ts";
import { createToken, setAuthCookie } from "@/lib/auth.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const data = await ctx.req.json().catch(() => null);
    if (data === null || typeof data !== "object") {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    const password = (data as { password?: string }).password ?? "";

    // An unset ADMIN_PASSWORD must never authenticate an empty password.
    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = Response.json({ success: true });
    setAuthCookie(response.headers, await createToken());

    return response;
  },
});
