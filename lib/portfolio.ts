import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/local-client.ts";
import { media } from "@/db/schema.ts";

/** Returns the sidebar profile picture's URL, or null if none has been uploaded yet. */
export async function getPfpSrc(): Promise<string | null> {
  const [row] = await getDb()
    .select({ src: media.src })
    .from(media)
    .where(eq(media.type, "pfp"))
    .orderBy(desc(media.id))
    .limit(1);
  return row?.src ?? null;
}
