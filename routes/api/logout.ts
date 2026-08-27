import { define } from "@/utils.ts";
import { clearAuthCookie } from "@/lib/auth.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  POST() {
    const response = redirectTo("/login");
    clearAuthCookie(response.headers);
    return response;
  },
});
