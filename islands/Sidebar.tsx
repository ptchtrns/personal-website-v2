import type { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  BarsIcon,
  CircleHalfStrokeIcon,
  GithubIcon,
  type IconProps,
  IdCardClipIcon,
  ImagesIcon,
  LinkedinIcon,
  ListUlIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "@/components/icons.tsx";
import { type Theme, updateTheme, watchSystemTheme } from "@/lib/theme.ts";

const socialMediaIcons: {
  url: string;
  icon: (props: IconProps) => JSX.Element;
}[] = [
  { url: "https://github.com/ptchtrns", icon: GithubIcon },
  { url: "https://www.linkedin.com/in/ptchtrns/", icon: LinkedinIcon },
];

const navItems: {
  title: string;
  url: string;
  icon: (props: IconProps) => JSX.Element;
}[] = [
  { title: "About me", url: "/", icon: UserIcon },
  { title: "Services", url: "/services", icon: ListUlIcon },
  { title: "Contact me", url: "/contact", icon: IdCardClipIcon },
  { title: "Media", url: "/media", icon: ImagesIcon },
];

const themes: { theme: Theme; icon: (props: IconProps) => JSX.Element }[] = [
  { theme: "dark", icon: MoonIcon },
  { theme: "light", icon: SunIcon },
  { theme: "system", icon: CircleHalfStrokeIcon },
];

interface SidebarProps {
  /** Current pathname, used to highlight the active nav item. */
  path: string;
  /** Profile picture URL fetched from the media table, or null if none is set. */
  pfpSrc: string | null;
}

export default function Sidebar({ path, pfpSrc }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => watchSystemTheme(() => {}), []);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open menu"
        class="md:hidden fixed top-6 left-0 z-50 rounded-l-none rounded-r-lg border-l-0 bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-600 active:scale-95"
      >
        <BarsIcon class="text-stone-800 dark:text-stone-200" />
      </Button>

      <div
        class={[
          "fixed top-0 left-0 bottom-0 right-0 backdrop-blur-3xl bg-gradient",
          "bg-linear-to-br via-transparent from-black/25 to-transparent dark:from-white/10 dark:to-white/5",
          isOpen ? "block md:hidden fixed" : "hidden",
        ].join(" ")}
        onClick={() => setIsOpen(false)}
      />

      <nav
        class={[
          "fixed w-64 xl:w-72 my-6 mx-12 transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-120",
        ].join(" ")}
      >
        <Card class="bg-white dark:bg-stone-900 rounded-[17px] flex flex-col p-3 border border-stone-300 dark:border-stone-700">
          <div class="px-3 pt-2 flex flex-col gap-2.5">
            {pfpSrc && (
              <img
                src={pfpSrc}
                alt="Nikolai Zakharov"
                class="rounded-full w-32"
              />
            )}
            <div>
              <h2 class="font-bold text-xl dark:text-stone-100">
                Nikolai Zakharov
              </h2>
              <span class="text-stone-700 dark:text-stone-400">@ptchtrns</span>
            </div>
          </div>

          <ul class="flex flex-col">
            {navItems.map((navItem) => {
              const Icon = navItem.icon;
              return (
                <li key={navItem.url}>
                  <a
                    href={navItem.url}
                    class={[
                      "w-full py-1.5 px-3 flex gap-4",
                      path === navItem.url
                        ? "font-bold text-stone-950 dark:text-white"
                        : "text-stone-700 dark:text-stone-300",
                      "hover:text-stone-950 dark:hover:text-white",
                      "hover:bg-linear-to-r from-stone-100 via-stone-100 to-stone-50 dark:from-stone-800 dark:via-stone-800 dark:to-stone-900",
                      "border border-transparent hover:border-stone-200 dark:hover:border-stone-600",
                      "rounded-lg active:scale-99 transition-all",
                    ].join(" ")}
                  >
                    <span class="w-4">
                      <Icon />
                    </span>
                    <span>{navItem.title}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <Separator />

          <footer class="flex flex-col gap-2">
            <div class="flex">
              {socialMediaIcons.map((socialMediaIcon) => {
                const Icon = socialMediaIcon.icon;
                return (
                  <Button
                    key={socialMediaIcon.url}
                    variant="ghost"
                    size="icon"
                    href={socialMediaIcon.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon class="text-lg" />
                  </Button>
                );
              })}
            </div>
          </footer>
        </Card>

        <div class="flex justify-between mt-4">
          <Card class="bg-white dark:bg-stone-900 rounded-[17px] flex flex-row p-1 border border-stone-300 dark:border-stone-700 gap-0">
            {themes.map((theme) => {
              const Icon = theme.icon;
              return (
                <Button
                  key={theme.theme}
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Use ${theme.theme} theme`}
                  onClick={() => updateTheme(theme.theme)}
                >
                  <Icon />
                </Button>
              );
            })}
          </Card>

          <div class="flex gap-2">
            {/* Language switching placeholder */}
          </div>
        </div>
      </nav>
    </>
  );
}
