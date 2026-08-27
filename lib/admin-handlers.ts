import type { FreshContext } from "fresh";
import { redirectTo } from "@/lib/http.ts";
import type { State } from "@/utils.ts";

/** Admin guard + `[id]` param parsing shared by the update and delete handlers; redirects on either failure. */
function requireAdminId(
  ctx: FreshContext<State>,
  tab: string,
): { redirect: Response } | { id: number } {
  if (!ctx.state.isAdmin) return { redirect: ctx.redirect("/login") };

  const id = Number(ctx.params.id);
  if (!Number.isInteger(id)) {
    return {
      redirect: redirectTo(
        `/admin?tab=${tab}&error=${encodeURIComponent("Invalid id")}`,
      ),
    };
  }
  return { id };
}

interface DeleteHandlerOptions {
  /** Admin tab to redirect back to, e.g. "gallery". */
  tab: string;
  /** Lowercase noun used in the failure message, e.g. "gallery item". */
  entityName: string;
  /** Full success message, e.g. "Photo deleted". */
  successMessage: string;
  deleteFn: (id: number) => Promise<void>;
}

/** Shared POST handler for the admin `/api/<resource>/[id]/delete` routes: id validation, delete, redirect with ok/error. */
export function createAdminDeleteHandler(
  { tab, entityName, successMessage, deleteFn }: DeleteHandlerOptions,
) {
  return async function DELETE(ctx: FreshContext<State>): Promise<Response> {
    const admin = requireAdminId(ctx, tab);
    if ("redirect" in admin) return admin.redirect;
    const { id } = admin;

    try {
      await deleteFn(id);
      return redirectTo(
        `/admin?tab=${tab}&ok=${encodeURIComponent(successMessage)}`,
      );
    } catch (error) {
      console.error(`Failed to delete ${entityName}`, error);
      return redirectTo(
        `/admin?tab=${tab}&error=${
          encodeURIComponent(`Failed to delete ${entityName}`)
        }`,
      );
    }
  };
}

interface UpdateHandlerOptions<T> {
  /** Admin tab to redirect back to, e.g. "music". */
  tab: string;
  /** Query param that reopens the edit dialog on failure, e.g. "edit" or "trackEdit". */
  editParam?: string;
  /** Lowercase noun used in the failure message, e.g. "work experience". */
  entityName: string;
  /** Full success message, e.g. "Project updated". */
  successMessage: string;
  /** Builds the raw input object from the submitted form, e.g. `{ title: formData.get("title") }`. */
  buildInput: (formData: FormData) => unknown;
  parseInput: (data: unknown) => { value: T } | { error: string };
  updateFn: (id: number, value: T) => Promise<unknown | null>;
}

/** Shared POST handler for the admin `/api/<resource>/[id]` routes: id validation, parse, update, redirect with ok/error. */
export function createAdminUpdateHandler<T>(
  {
    tab,
    editParam = "edit",
    entityName,
    successMessage,
    buildInput,
    parseInput,
    updateFn,
  }: UpdateHandlerOptions<T>,
) {
  return async function POST(ctx: FreshContext<State>): Promise<Response> {
    const admin = requireAdminId(ctx, tab);
    if ("redirect" in admin) return admin.redirect;
    const { id } = admin;

    const formData = await ctx.req.formData();
    const parsed = parseInput(buildInput(formData));
    if ("error" in parsed) {
      return redirectTo(
        `/admin?tab=${tab}&${editParam}=${id}&error=${
          encodeURIComponent(parsed.error)
        }`,
      );
    }

    try {
      const updated = await updateFn(id, parsed.value);
      if (!updated) {
        return redirectTo(
          `/admin?tab=${tab}&error=${encodeURIComponent("Not found")}`,
        );
      }
      return redirectTo(
        `/admin?tab=${tab}&ok=${encodeURIComponent(successMessage)}`,
      );
    } catch (error) {
      console.error(`Failed to update ${entityName}`, error);
      return redirectTo(
        `/admin?tab=${tab}&${editParam}=${id}&error=${
          encodeURIComponent(`Failed to update ${entityName}`)
        }`,
      );
    }
  };
}
