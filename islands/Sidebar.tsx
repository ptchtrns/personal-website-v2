import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faCircleHalfStroke,
  faIdCardClip,
  faImages,
  faMoon,
  faMusic,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useEffect, useState } from "preact/hooks";
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { FaIcon } from "@/components/icon.tsx";
import {
  getStoredTheme,
  type Theme,
  updateTheme,
  watchSystemTheme,
} from "@/lib/theme.ts";

const socialMediaIcons: { url: string; icon: IconDefinition }[] = [
  { url: "https://github.com/ptchtrns", icon: faGithub },
  { url: "https://www.linkedin.com/in/ptchtrns/", icon: faLinkedin },
];

const navItems: {
  title: string;
  url: string;
  /** Prefix used to highlight this item for nested routes. */
  matchPrefix?: string;
  icon: IconDefinition;
}[] = [
  { title: "About me", url: "/", icon: faUser },
  { title: "Contact me", url: "/contact", icon: faIdCardClip },
  {
    title: "Photos",
    url: "/media/photos",
    matchPrefix: "/media/photos",
    icon: faImages,
  },
  {
    title: "Music",
    url: "/media/music",
    matchPrefix: "/media/music",
    icon: faMusic,
  },
];

const themes: { theme: Theme; icon: IconDefinition }[] = [
  { theme: "dark", icon: faMoon },
  { theme: "light", icon: faSun },
  { theme: "system", icon: faCircleHalfStroke },
];

interface SidebarProps {
  /** Current pathname, used to highlight the active nav item. */
  path: string;
  /** Profile picture URL fetched from the media table, or null if none is set. */
  pfpSrc: string | null;
}

export default function Sidebar({ path, pfpSrc }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Content nav is swapped via a Fresh Partial, so the layout (and this
  // island) never re-renders on navigation — track the active path ourselves.
  const [activePath, setActivePath] = useState(path);
  const [activeTheme, setActiveTheme] = useState<Theme>("system");

  useEffect(() => {
    setActiveTheme(getStoredTheme());
    return watchSystemTheme(setActiveTheme);
  }, []);

  useEffect(() => {
    const onPopState = () => setActivePath(globalThis.location.pathname);
    addEventListener("popstate", onPopState);
    return () => removeEventListener("popstate", onPopState);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open menu"
        class="lg:hidden fixed top-6 left-0 z-50 rounded-l-none rounded-r-lg border-l-0 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 active:scale-95"
      >
        <FaIcon icon={faBars} class="text-zinc-800 dark:text-zinc-200" />
      </Button>

      <div
        class={[
          "fixed top-0 left-0 bottom-0 right-0 z-40 backdrop-blur-3xl bg-gradient",
          "bg-linear-to-br via-transparent from-black/25 to-transparent dark:from-white/10 dark:to-white/5",
          isOpen ? "block lg:hidden fixed" : "hidden",
        ].join(" ")}
        onClick={() => setIsOpen(false)}
      />

      <nav
        class={[
          "fixed z-40 w-64 xl:w-72 my-6 mx-12 transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-120",
        ].join(" ")}
      >
        <Card class="bg-white dark:bg-zinc-900 rounded-[17px] flex flex-col p-3">
          <div class="px-3 pt-2 flex flex-col gap-2.5">
            {pfpSrc && (
              <img
                src={pfpSrc}
                alt="Nikolai Zakharov"
                class="rounded-full w-32"
              />
            )}
            <div>
              <h2 class="font-bold text-xl dark:text-zinc-100">
                Nikolai Zakharov
              </h2>
              <span class="text-zinc-700 dark:text-zinc-400">@ptchtrns</span>
            </div>
          </div>

          <ul class="flex flex-col">
            {navItems.map((navItem) => {
              const active = navItem.matchPrefix
                ? activePath.startsWith(navItem.matchPrefix)
                : activePath === navItem.url;
              return (
                <li key={navItem.url}>
                  <a
                    href={navItem.url}
                    onClick={() => {
                      setActivePath(navItem.url);
                      setIsOpen(false);
                    }}
                    class={[
                      "w-full py-1.5 px-3 flex gap-4",
                      active
                        ? "font-bold text-zinc-950 dark:text-white"
                        : "text-zinc-700 dark:text-zinc-300",
                      "hover:text-zinc-950 dark:hover:text-white",
                      "hover:bg-linear-to-r from-zinc-100 via-zinc-100 to-zinc-50 dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-900",
                      "border border-transparent hover:border-zinc-200 dark:hover:border-zinc-600",
                      "rounded-lg active:scale-99 transition-all",
                    ].join(" ")}
                  >
                    <span class="w-4">
                      <FaIcon icon={navItem.icon} />
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
              {socialMediaIcons.map((socialMediaIcon) => (
                <Button
                  key={socialMediaIcon.url}
                  variant="ghost"
                  size="icon"
                  href={socialMediaIcon.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaIcon icon={socialMediaIcon.icon} class="text-lg" />
                </Button>
              ))}
            </div>
          </footer>
        </Card>

        <div class="flex justify-between mt-4">
          <Card class="bg-white dark:bg-zinc-900 rounded-[17px] flex flex-row p-1 gap-0">
            {themes.map((theme) => (
              <Button
                key={theme.theme}
                variant="ghost"
                size="icon-sm"
                class={activeTheme === theme.theme
                  ? "bg-zinc-200 dark:bg-zinc-700 font-bold text-zinc-950 dark:text-white"
                  : "text-zinc-500 dark:text-zinc-500"}
                aria-label={`Use ${theme.theme} theme`}
                onClick={() => {
                  updateTheme(theme.theme);
                  setActiveTheme(theme.theme);
                }}
              >
                <FaIcon icon={theme.icon} />
              </Button>
            ))}
          </Card>

          <div class="flex gap-2">
            {/* Language switching placeholder */}
          </div>
        </div>
      </nav>
    </>
  );
}
