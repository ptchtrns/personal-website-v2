import { App, staticFiles } from "fresh";
import { getCookies } from "@std/http/cookie";
import { define, type State } from "./utils.ts";
import { COOKIE_NAME, validateToken } from "@/lib/auth.ts";

export const app = new App<State>();

app.use(staticFiles());

// Resolve the admin session once per request so routes and layouts can read it.
const authMiddleware = define.middleware(async (ctx) => {
  const token = getCookies(ctx.req.headers)[COOKIE_NAME];
  ctx.state.isAdmin = await validateToken(token);
  return await ctx.next();
});
app.use(authMiddleware);

// Include file-system based routes here
app.fsRoutes();
