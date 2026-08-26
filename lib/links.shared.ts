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
  "github.com": "GitHub",
  "www.linkedin.com": "LinkedIn",
  "linkedin.com": "LinkedIn",
};

/** Maps a link's hostname to a human-readable label, falling back to the hostname itself. */
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
