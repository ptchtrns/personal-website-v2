/** 303 redirect for the post/redirect/get pattern: browser re-issues a GET at the new URL instead of resubmitting the form. */
export function redirectTo(url: string): Response {
  return new Response(null, { status: 303, headers: { Location: url } });
}
