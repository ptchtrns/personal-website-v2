import { type ComponentChildren, createContext, type JSX } from "preact";
import { useContext, useId, useState } from "preact/hooks";
import { cn } from "@/lib/utils.ts";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Tabs>`);
  return ctx;
}

type TabsProps = Omit<JSX.IntrinsicElements["div"], "onChange"> & {
  defaultValue: string;
  onValueChange?: (value: string) => void;
  children?: ComponentChildren;
};

export function Tabs(
  { class: className, defaultValue, onValueChange, children, ...props }:
    TabsProps,
) {
  const [value, setValue] = useState(defaultValue);
  const baseId = useId();

  function select(next: string) {
    setValue(next);
    onValueChange?.(next);
  }

  return (
    <TabsContext.Provider value={{ value, setValue: select, baseId }}>
      <div
        data-slot="tabs"
        class={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList(
  { class: className, ...props }: JSX.IntrinsicElements["div"],
) {
  return (
    <div
      role="tablist"
      data-slot="tabs-list"
      class={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className,
      )}
      {...props}
    />
  );
}

type TabsTriggerProps = JSX.IntrinsicElements["button"] & {
  value: string;
};

export function TabsTrigger(
  { class: className, value, ...props }: TabsTriggerProps,
) {
  const tabs = useTabs("TabsTrigger");
  const active = tabs.value === value;

  return (
    <button
      type="button"
      role="tab"
      id={`${tabs.baseId}-trigger-${value}`}
      aria-selected={active}
      aria-controls={`${tabs.baseId}-content-${value}`}
      data-slot="tabs-trigger"
      data-state={active ? "active" : "inactive"}
      onClick={() => tabs.setValue(value)}
      class={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

type TabsContentProps = JSX.IntrinsicElements["div"] & {
  value: string;
};

export function TabsContent(
  { class: className, value, ...props }: TabsContentProps,
) {
  const tabs = useTabs("TabsContent");
  const active = tabs.value === value;

  return (
    <div
      role="tabpanel"
      id={`${tabs.baseId}-content-${value}`}
      aria-labelledby={`${tabs.baseId}-trigger-${value}`}
      data-slot="tabs-content"
      data-state={active ? "active" : "inactive"}
      hidden={!active}
      class={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}
