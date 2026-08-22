import { define } from "../utils.ts";
import Sidebar from "@/islands/Sidebar.tsx";

export default define.page(function SidebarLayout({ Component, url }) {
  return (
    <div class="flex mx-auto 2xl:max-w-[1600px]">
      <Sidebar path={url.pathname} />
      <div class="ml-6 md:ml-86 xl:ml-106 mr-6 md:mr-24 w-full">
        <Component />
      </div>
    </div>
  );
});
