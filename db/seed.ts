import { extname } from "@std/path";
import { and, eq } from "drizzle-orm";
import { type Db, getDb } from "@/db/local-client.ts";
import {
  gallery,
  media,
  projects,
  projectsToMedia,
  releases,
  tracks,
} from "@/db/schema.ts";
import { getConfig } from "@/lib/config.ts";
import {
  disposeLocalStorage,
  getCdnBucket,
  type LocalR2Bucket,
} from "@/lib/storage-local.ts";

/** Puts a seed file into the local CDN bucket and returns its public URL. */
async function uploadSeedFile(
  bucket: LocalR2Bucket,
  folder: string,
  file: URL,
): Promise<string> {
  const key = `media/${folder}/${crypto.randomUUID()}/original${
    extname(file.pathname)
  }`;
  await bucket.put(key, await Deno.readFile(file));
  const { PHOTO_BASE_URL } = await getConfig();
  return `${PHOTO_BASE_URL}/${key}`;
}

const projectsSeed: (typeof projects.$inferInsert & {
  logoFile?: URL;
  screenshotFiles?: URL[];
})[] = [
  {
    name: "SimPictures",
    description:
      "- Social media platform for sharing flight simulator screenshots.\n" +
      "- Built with Next.js and PostgreSQL. ASP.NET, multiple AWS services (s3, CloudFront, App Runner, ECR, Rekognition), Vercel, Discord.Net and Appsmith are also utilized.\n" +
      "- Implemented account management, image upload and processing, custom UI design and components.\n" +
      "- To be open-sourced in 2026.",
    shortOverview:
      "Social media platform for sharing flight simulator screenshots.",
    externalUrl: "https://www.simpictures.com/",
    isPinned: true,
    screenshotFiles: [
      new URL("../seed/SimPictures_home_page.avif", import.meta.url),
      new URL("../seed/SimPictures_profile_page.avif", import.meta.url),
      new URL("../seed/SimPictures_picture_view.avif", import.meta.url),
      new URL("../seed/SimPictures_metadata_page.avif", import.meta.url),
      new URL("../seed/SimPictures_crop_page.avif", import.meta.url),
    ],
  },
  {
    name: "slimew4re",
    description: "- Xbox NXE Dashboard-styled website for a music artist.\n" +
      "- Supports creating and editing tiles and content.",
    shortOverview:
      "Xbox NXE Dashboard-styled website for a music artist, with ability to create and edit tiles and content.",
    externalUrl: "https://www.slimew4re.com/live",
    screenshotFiles: [
      new URL("../seed/slimew4re_1.avif", import.meta.url),
      new URL("../seed/slimew4re_2.avif", import.meta.url),
    ],
  },
];

const gallerySeed: { alt: string; file: URL }[] = [
  {
    alt: "20240828_152407",
    file: new URL("../seed/20240828_152407.avif", import.meta.url),
  },
  {
    alt: "20240831_185046",
    file: new URL("../seed/20240831_185046.avif", import.meta.url),
  },
  {
    alt: "20240919_220651_862",
    file: new URL("../seed/20240919_220651_862.avif", import.meta.url),
  },
  {
    alt: "20241127_150530",
    file: new URL("../seed/20241127_150530.avif", import.meta.url),
  },
  {
    alt: "20250518_192239",
    file: new URL("../seed/20250518_192239.avif", import.meta.url),
  },
  {
    alt: "20260705_123908",
    file: new URL("../seed/20260705_123908.avif", import.meta.url),
  },
];

const pfpSeed = { file: new URL("../seed/nikolai.avif", import.meta.url) };

const ALBUM_TITLE = "public void";
const ALBUM_DESCRIPTION =
  "An album of glitchy, noise-leaning electronic tracks.";
const albumCoverSeed = {
  file: new URL("../seed/Public-Void-cover-art.avif", import.meta.url),
};
const albumLinksSeed = [
  "https://open.spotify.com/album/7vJvzJnPvjCsFcClsxCwL3?si=feNvqoQlR9afaUiH4G4i0A",
  "https://geo.music.apple.com/au/album/public-void/1820747963?app=music&ls=1",
  "https://geo.music.apple.com/au/album/public-void/1820747963?app=itunes&ls=1",
  "http://www.tidal.com/album/442224873",
  "https://www.youtube.com/playlist?list=OLAK5uy_kf3lqtpq1cgL3IjU3i9cjAgQ3QwvJewAM",
  "https://music.youtube.com/playlist?list=OLAK5uy_kf3lqtpq1cgL3IjU3i9cjAgQ3QwvJewAM",
  "https://pitchtransition.bandcamp.com/album/public-void",
  "https://www.deezer.com/album/772875501",
  "https://music.amazon.com/albums/B0FD8QWC7K?ref=dm_ff_amazonmusic_3p",
  "https://pandora.app.link/?$desktop_url=https%3A%2F%2Fwww.pandora.com%2Fartist%2Fpitch-transition-and-m4lw4re%2Fpublic-void%2FALfJX4Kxbt9bnJ6&$ios_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Falbum%3Ftoken%3DAL%3A49587170&$android_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Falbum%3Ftoken%3DAL%3A49587170&~channel=Partner%20Catalog%20Search%20API",
];

/** All seed tracks belong to a single seed album. */
const musicSeed: { title: string; file: URL }[] = [
  {
    title: "public void",
    file: new URL("../seed/1. public void.mp3", import.meta.url),
  },
  {
    title: "flashing images",
    file: new URL("../seed/2. flashing images.mp3", import.meta.url),
  },
  {
    title: "bluenery",
    file: new URL("../seed/3. bluenery.mp3", import.meta.url),
  },
  {
    title: "bluenery short",
    file: new URL("../seed/4. bluenery short.mp3", import.meta.url),
  },
  {
    title: "tcp_ip",
    file: new URL("../seed/5. tcp_ip.mp3", import.meta.url),
  },
  {
    title: "internet things",
    file: new URL("../seed/6. internet things.mp3", import.meta.url),
  },
  {
    title: "air",
    file: new URL("../seed/7. air.mp3", import.meta.url),
  },
  {
    title: "destructive_self",
    file: new URL("../seed/8. destructive_self.mp3", import.meta.url),
  },
  {
    title: "direction",
    file: new URL("../seed/9. direction.mp3", import.meta.url),
  },
];

/** Inserts each seed project and uploads its screenshots as linked media. */
async function seedProjects(db: Db, bucket: LocalR2Bucket) {
  for (const { screenshotFiles, ...row } of projectsSeed) {
    const existing = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.name, row.name))
      .limit(1);
    if (existing.length > 0) continue;

    const [projectRow] = await db.insert(projects).values(row).returning();

    for (const [order, file] of (screenshotFiles ?? []).entries()) {
      const src = await uploadSeedFile(bucket, "projects", file);
      const [mediaRow] = await db.insert(media).values({ src, type: "image" })
        .returning();
      await db.insert(projectsToMedia).values({
        projectId: projectRow.id,
        mediaId: mediaRow.id,
        order,
      });
    }
  }
}

/**
 * Puts each seed image's bytes into the local CDN bucket (Miniflare's R2
 * emulation, see `lib/storage-local.ts`) and inserts the matching
 * `media`/`gallery` rows, so `/media` has something to show in local dev.
 */
async function seedGallery(db: Db, bucket: LocalR2Bucket) {
  for (const item of gallerySeed) {
    const existing = await db
      .select({ id: gallery.id })
      .from(gallery)
      .innerJoin(media, eq(gallery.imageId, media.id))
      .where(eq(media.alt, item.alt))
      .limit(1);
    if (existing.length > 0) continue;

    const src = await uploadSeedFile(bucket, "gallery", item.file);
    const [mediaRow] = await db.insert(media).values({
      src,
      type: "image",
      alt: item.alt,
    }).returning();
    await db.insert(gallery).values({ imageId: mediaRow.id });
  }
}

/** Uploads each seed track's audio bytes and inserts them all as tracks on one seed album, so `/media`'s audio tab has something to play in local dev. */
async function seedMusic(db: Db, bucket: LocalR2Bucket) {
  let [albumRow] = await db
    .select({ id: releases.id })
    .from(releases)
    .where(eq(releases.title, ALBUM_TITLE))
    .limit(1);

  if (!albumRow) {
    const coverSrc = await uploadSeedFile(bucket, "music", albumCoverSeed.file);
    const [coverMediaRow] = await db.insert(media).values({
      src: coverSrc,
      type: "image",
    }).returning();
    [albumRow] = await db.insert(releases).values({
      title: ALBUM_TITLE,
      type: "album",
      coverId: coverMediaRow.id,
      description: ALBUM_DESCRIPTION,
      links: albumLinksSeed,
    }).returning();
  }

  for (const item of musicSeed) {
    const existing = await db
      .select({ id: tracks.id })
      .from(tracks)
      .where(
        and(eq(tracks.title, item.title), eq(tracks.releaseId, albumRow.id)),
      )
      .limit(1);
    if (existing.length > 0) continue;

    const src = await uploadSeedFile(bucket, "music", item.file);
    const [mediaRow] = await db.insert(media).values({ src, type: "audio" })
      .returning();
    await db.insert(tracks).values({
      title: item.title,
      audioId: mediaRow.id,
      releaseId: albumRow.id,
    });
  }
}

/** Uploads the seed profile picture and inserts it as the sole `pfp` media row, if one doesn't already exist. */
async function seedPfp(db: Db, bucket: LocalR2Bucket) {
  const existing = await db
    .select({ id: media.id })
    .from(media)
    .where(eq(media.type, "pfp"))
    .limit(1);
  if (existing.length > 0) return;

  const src = await uploadSeedFile(bucket, "pfp", pfpSeed.file);
  await db.insert(media).values({ src, type: "pfp" });
}

async function main() {
  const db = await getDb();
  const bucket = await getCdnBucket();
  await seedProjects(db, bucket);
  await seedGallery(db, bucket);
  await seedMusic(db, bucket);
  await seedPfp(db, bucket);
  await disposeLocalStorage();
  console.log("Seed complete.");
}

if (import.meta.main) {
  await main();
}
