import { define } from "../utils.ts";
import { MainDisplay } from "@/components/layout/MainDisplay.tsx";
import LoginForm from "@/islands/LoginForm.tsx";

export const handler = define.handlers({
  GET(ctx) {
    // Already signed in, no reason to show the form again.
    if (ctx.state.isAdmin) return ctx.redirect("/admin");
    return { data: null };
  },
});

export default define.page(function Login() {
  return (
    <MainDisplay>
      <div class="w-full max-w-sm">
        <LoginForm />
      </div>
    </MainDisplay>
  );
});
