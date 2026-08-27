import { cn } from "@/lib/utils.ts";

const TABS = [
  { value: "photos", label: "Photos", url: "/media/photos" },
  { value: "audio", label: "Audio", url: "/media/audio" },
] as const;

export function MediaTabsNav({ active }: { active: "photos" | "audio" }) {
  return (
    <div
      role="tablist"
      class="bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] gap-1"
    >
      {TABS.map((tab) => (
        <a
          key={tab.value}
          href={tab.url}
          role="tab"
          aria-selected={active === tab.value}
          data-state={active === tab.value ? "active" : "inactive"}
          class={cn(
            "data-[state=active]:bg-background dark:data-[state=active]:text-foreground text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] data-[state=active]:shadow-sm",
          )}
        >
          {tab.label}
        </a>
      ))}
    </div>
  );
}
