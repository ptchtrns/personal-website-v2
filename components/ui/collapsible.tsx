import { type ComponentChildren, createContext, type JSX } from "preact";
import { useContext } from "preact/hooks";

interface CollapsibleContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(
  null,
);

function useCollapsible(component: string) {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) {
    throw new Error(`<${component}> must be used inside <Collapsible>`);
  }
  return ctx;
}

interface CollapsibleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  class?: string;
  children?: ComponentChildren;
}

export function Collapsible(
  { open, onOpenChange, class: className, children }: CollapsibleProps,
) {
  return (
    <CollapsibleContext.Provider value={{ open, onOpenChange }}>
      <div data-slot="collapsible" class={className}>{children}</div>
    </CollapsibleContext.Provider>
  );
}

export function CollapsibleTrigger(
  { class: className, children, ...props }: JSX.IntrinsicElements["button"],
) {
  const { open, onOpenChange } = useCollapsible("CollapsibleTrigger");
  return (
    <button
      type="button"
      data-slot="collapsible-trigger"
      aria-expanded={open}
      onClick={() => onOpenChange(!open)}
      class={className}
      {...props}
    >
      {children}
    </button>
  );
}

export function CollapsibleContent(
  { class: className, children, ...props }: JSX.IntrinsicElements["div"],
) {
  const { open } = useCollapsible("CollapsibleContent");
  if (!open) return null;
  return (
    <div data-slot="collapsible-content" class={className} {...props}>
      {children}
    </div>
  );
}
