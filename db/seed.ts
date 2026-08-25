import { extname } from "@std/path";
import { and, eq } from "drizzle-orm";
import { type Db, getDb } from "@/db/local-client.ts";
import {
  education,
  gallery,
  media,
  projects,
  releases,
  tracks,
  workExperience,
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

const workExperienceSeed: (typeof workExperience.$inferInsert)[] = [
  {
    jobTitle: "UI Development Trainee - Internship",
    companyName: "Peikko Group",
    companyUrl: "https://www.peikko.com/",
    startedAt: new Date("2024-10-01T00:00:00Z"),
    finishedAt: new Date("2025-05-01T00:00:00Z"),
    description: [
      "Built UI layout and components, accurately following company's design guidelines and ensuring accessibility.",
      "Used Blazor (C#) and Azure DevOps.",
      "Used Three.js library to display 3D objects.",
      "Worked in group and collaborated with students from LAB University of Applied Sciences.",
    ],
  },
];

const educationSeed:
  (Omit<typeof education.$inferInsert, "institutionLogoSrc"> & {
    logoFile: URL;
  })[] = [
    {
      degreeTitle:
        "Information and Communication Technology - Bachelor's degree (In Progress)",
      degreeType: "Bachelor's degree",
      educationInstitution: "Metropolia University of Applied Sciences",
      logoFile: new URL("../seed/metropolia_logo.avif", import.meta.url),
      startedAt: new Date("2025-08-01T00:00:00Z"),
      finishedAt: null,
    },
    {
      degreeTitle: "Software Engineering - Vocational undergraduate degree",
      degreeType: "Vocational undergraduate degree",
      educationInstitution: "Salpaus Further Education",
      logoFile: new URL("../seed/salpaus_logo.avif", import.meta.url),
      startedAt: new Date("2023-01-01T00:00:00Z"),
      finishedAt: new Date("2025-06-01T00:00:00Z"),
    },
  ];

const projectsSeed: (typeof projects.$inferInsert & { logoFile?: URL })[] = [
  {
    name: "SimPictures",
    description: [
      "Social media platform for sharing flight simulator screenshots.",
      "Built with Next.js and PostgreSQL. ASP.NET, multiple AWS services (s3, CloudFront, App Runner, ECR, Rekognition), Vercel, Discord.Net and Appsmith are also utilized.",
      "Implemented account management, image upload and processing, custom UI design and components.",
      "To be open-sourced in 2026.",
    ],
    externalUrl: "https://www.simpictures.com/",
    isPinned: true,
  },
];

const gallerySeed: { description: string; file: URL }[] = [
  {
    description: "20240828_152407",
    file: new URL("../seed/20240828_152407.avif", import.meta.url),
  },
  {
    description: "20240831_185046",
    file: new URL("../seed/20240831_185046.avif", import.meta.url),
  },
  {
    description: "20240919_220651_862",
    file: new URL("../seed/20240919_220651_862.avif", import.meta.url),
  },
  {
    description: "20241127_150530",
    file: new URL("../seed/20241127_150530.avif", import.meta.url),
  },
  {
    description: "20250518_192239",
    file: new URL("../seed/20250518_192239.avif", import.meta.url),
  },
  {
    description: "20260705_123908",
    file: new URL("../seed/20260705_123908.avif", import.meta.url),
  },
];

const pfpSeed = { file: new URL("../seed/nikolai.avif", import.meta.url) };

const ALBUM_TITLE = "public void";
const albumCoverSeed = {
  file: new URL("../seed/Public-Void-cover-art.avif", import.meta.url),
};

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

/** Inserts each seed row only if a row with the same natural key isn't already present, so re-running never clobbers admin edits. */
async function seedWorkExperience(db: Db) {
  for (const row of workExperienceSeed) {
    const existing = await db
      .select({ id: workExperience.id })
      .from(workExperience)
      .where(
        and(
          eq(workExperience.jobTitle, row.jobTitle),
          eq(workExperience.companyName, row.companyName),
        ),
      )
      .limit(1);
    if (existing.length > 0) continue;
    await db.insert(workExperience).values(row);
  }
}

async function seedEducation(db: Db, bucket: LocalR2Bucket) {
  for (const { logoFile, ...row } of educationSeed) {
    const existing = await db
      .select({ id: education.id })
      .from(education)
      .where(
        and(
          eq(education.degreeTitle, row.degreeTitle),
          eq(education.educationInstitution, row.educationInstitution),
        ),
      )
      .limit(1);
    if (existing.length > 0) continue;

    const institutionLogoSrc = await uploadSeedFile(
      bucket,
      "education",
      logoFile,
    );
    await db.insert(education).values({ ...row, institutionLogoSrc });
  }
}

/** Inserts each seed project. */
async function seedProjects(db: Db) {
  for (const row of projectsSeed) {
    const existing = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.name, row.name))
      .limit(1);
    if (existing.length > 0) continue;

    await db.insert(projects).values(row);
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
      .where(eq(gallery.description, item.description))
      .limit(1);
    if (existing.length > 0) continue;

    const src = await uploadSeedFile(bucket, "gallery", item.file);
    const [mediaRow] = await db.insert(media).values({ src, type: "image" })
      .returning();
    await db.insert(gallery).values({
      description: item.description,
      imageId: mediaRow.id,
    });
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
  await seedWorkExperience(db);
  await seedEducation(db, bucket);
  await seedProjects(db);
  await seedGallery(db, bucket);
  await seedMusic(db, bucket);
  await seedPfp(db, bucket);
  await disposeLocalStorage();
  console.log("Seed complete.");
}

if (import.meta.main) {
  await main();
}
