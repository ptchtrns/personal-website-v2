import { define } from "../../utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    return ctx.redirect("/media/photos");
  },
});
