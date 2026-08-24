import { Button } from "@/components/ui/button.tsx";

interface DeleteConfirmProps {
  label: string;
  action: string;
  cancelHref: string;
}

/** Native two-step delete: a plain link arms this, a real `<form>` POST confirms it. No JS confirm() dialog needed. */
export function DeleteConfirm(
  { label, action, cancelHref }: DeleteConfirmProps,
) {
  return (
    <div class="flex flex-col gap-3 p-3 border border-red-300 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-950/30">
      <p class="text-sm">Delete {label}? This can't be undone.</p>
      <div class="flex gap-2">
        <form method="POST" action={action}>
          <Button type="submit" size="sm" variant="destructive">
            Yes, delete
          </Button>
        </form>
        <Button href={cancelHref} size="sm" variant="outline">Cancel</Button>
      </div>
    </div>
  );
}
