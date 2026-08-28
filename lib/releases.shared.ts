export { getLinkLabel } from "@/lib/links.shared.ts";

export type ReleaseType = "album" | "ep" | "single";
export const RELEASE_TYPES: ReleaseType[] = ["album", "ep", "single"];

export interface TrackItem {
  id: number;
  title: string;
  audioId: number;
  audioSrc: string;
  releaseId: number;
}

export interface ReleaseItem {
  id: number;
  title: string;
  type: ReleaseType;
  coverId: number | null;
  coverSrc: string | null;
  description: string | null;
  links: string[] | null;
  createdAt: Date;
  tracks: TrackItem[];
}
