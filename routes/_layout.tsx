import { Partial } from "fresh/runtime";
import { define } from "../utils.ts";
import Sidebar from "@/islands/Sidebar.tsx";
import AudioPlayer from "@/islands/AudioPlayer.tsx";

export default define.page(function SidebarLayout({ Component, url, state }) {
  return (
    <div class="flex mx-auto 2xl:max-w-[1600px]">
      <Sidebar path={url.pathname} pfpSrc={state.pfpSrc} />
      <div
        id="page-main"
        class="ml-6 lg:ml-86 xl:ml-106 mr-6 lg:mr-24 w-full min-w-0"
      >
        <Partial name="page-content">
          <Component />
        </Partial>
      </div>
      <AudioPlayer />
    </div>
  );
});
