import { define } from "../utils.ts";
import { MainDisplay } from "@/components/layout/MainDisplay.tsx";
import AdminTabs from "@/islands/AdminTabs.tsx";

export const handler = define.handlers({
  GET(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");
    return { data: null };
  },
});

export default define.page(function Admin() {
  return (
    <MainDisplay>
      <AdminTabs />
    </MainDisplay>
  );
});
