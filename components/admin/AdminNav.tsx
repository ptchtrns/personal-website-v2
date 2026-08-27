import { cn } from "@/lib/utils.ts";

const TABS = [
  { value: "media", label: "Media" },
  { value: "gallery", label: "Gallery" },
  { value: "music", label: "Music" },
  { value: "education", label: "Education" },
  { value: "work-experience", label: "Work experience" },
  { value: "projects", label: "Projects" },
  { value: "site-settings", label: "Site settings" },
] as const;

/**
 * Plain server-rendered nav standing in for the old radix-style `<Tabs>`
 * island: each tab is a real link to `/admin?tab=X`, so switching tabs is a
 * full navigation and needs no client-side JavaScript.
 */
export function AdminNav({ active }: { active: string }) {
  return (
    <div
      role="tablist"
      class="bg-muted text-muted-foreground inline-flex h-9 w-fit flex-wrap items-center justify-center rounded-lg p-[3px]"
    >
      {TABS.map((tab) => {
        const isActive = active === tab.value;
        return (
          <a
            key={tab.value}
            href={`/admin?tab=${tab.value}`}
            role="tab"
            aria-selected={isActive}
            data-state={isActive ? "active" : "inactive"}
            class={cn(
              "data-[state=active]:bg-background dark:data-[state=active]:text-foreground",
              "dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30",
              "text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] data-[state=active]:shadow-sm",
            )}
          >
            {tab.label}
          </a>
        );
      })}
    </div>
  );
}
