import { createDefine } from "fresh";

// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
  /** Whether the request carries a valid admin session cookie. */
  isAdmin: boolean;
  /** Sidebar profile picture URL, resolved once per request. */
  pfpSrc: string | null;
}

export const define = createDefine<State>();
