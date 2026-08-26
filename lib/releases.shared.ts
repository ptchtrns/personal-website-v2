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
  tracks: TrackItem[];
}

const LINK_LABELS_BY_HOSTNAME: Record<string, string> = {
  "open.spotify.com": "Spotify",
  "geo.music.apple.com": "Apple Music",
  "music.apple.com": "Apple Music",
  "www.tidal.com": "Tidal",
  "tidal.com": "Tidal",
  "www.youtube.com": "YouTube",
  "music.youtube.com": "YouTube Music",
  "bandcamp.com": "Bandcamp",
  "www.deezer.com": "Deezer",
  "deezer.com": "Deezer",
  "music.amazon.com": "Amazon Music",
  "pandora.app.link": "Pandora",
  "www.pandora.com": "Pandora",
};

/** Maps a streaming link's hostname to a human-readable platform name, falling back to the hostname itself. */
export function getLinkLabel(url: string): string {
  try {
    const { hostname } = new URL(url);
    if (LINK_LABELS_BY_HOSTNAME[hostname]) {
      return LINK_LABELS_BY_HOSTNAME[hostname];
    }
    if (hostname.endsWith(".bandcamp.com")) return "Bandcamp";
    return hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
