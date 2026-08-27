export function FormMessage(
  { error, ok }: { error?: string | null; ok?: string | null },
) {
  if (error) {
    return (
      <div class="p-3 bg-red-100 border border-red-300 rounded text-red-900 text-sm">
        {error}
      </div>
    );
  }
  if (ok) {
    return (
      <div class="p-3 bg-green-100 border border-green-300 rounded text-green-900 text-sm">
        {ok}
      </div>
    );
  }
  return null;
}
