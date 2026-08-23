import { extname } from "@std/path";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db/local-client.ts";
import {
  education,
  gallery,
  media,
  music,
  projects,
  projectsToMedia,
  workExperience,
} from "@/db/schema.ts";
import { PHOTO_BASE_URL } from "@/lib/config.ts";
import {
  disposeLocalStorage,
  getCdnBucket,
  type LocalR2Bucket,
} from "@/lib/storage-local.ts";

type Db = ReturnType<typeof getDb>;

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
      logoFile: new URL("../seed/metropolia_logo.png", import.meta.url),
      startedAt: new Date("2025-08-01T00:00:00Z"),
      finishedAt: null,
    },
    {
      degreeTitle: "Software Engineering - Vocational undergraduate degree",
      degreeType: "Vocational undergraduate degree",
      educationInstitution: "Salpaus Further Education",
      logoFile: new URL("../seed/salpaus_logo.png", import.meta.url),
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
    logoFile: new URL("../seed/simpictures_logo.svg", import.meta.url),
  },
];

const gallerySeed: { description: string; file: URL }[] = [
  {
    description: "20240828_152407",
    file: new URL("../seed/20240828_152407.jpg", import.meta.url),
  },
  {
    description: "20240831_185046",
    file: new URL("../seed/20240831_185046.jpg", import.meta.url),
  },
  {
    description: "20240919_220651_862",
    file: new URL("../seed/20240919_220651_862.jpg", import.meta.url),
  },
  {
    description: "20241127_150530",
    file: new URL("../seed/20241127_150530.jpg", import.meta.url),
  },
  {
    description: "20250518_192239",
    file: new URL("../seed/20250518_192239.jpg", import.meta.url),
  },
  {
    description: "20260705_123908",
    file: new URL("../seed/20260705_123908.jpg", import.meta.url),
  },
];

const pfpSeed = { file: new URL("../seed/nikolai.jpg", import.meta.url) };

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

/**
 * Inserts each seed project and, if it has a logo, uploads it as a `media`
 * row linked through `projects_to_media`.
 */
async function seedProjects(db: Db, bucket: LocalR2Bucket) {
  for (const { logoFile, ...row } of projectsSeed) {
    const existing = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.name, row.name))
      .limit(1);
    if (existing.length > 0) continue;

    const [projectRow] = await db.insert(projects).values(row).returning();

    if (logoFile) {
      const src = await uploadSeedFile(bucket, "projects", logoFile);
      const [mediaRow] = await db.insert(media).values({ src, type: "image" })
        .returning();
      await db.insert(projectsToMedia).values({
        projectId: projectRow.id,
        mediaId: mediaRow.id,
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

/** Uploads each seed track's audio bytes and inserts the matching `music` row, so `/media`'s audio tab has something to play in local dev. */
async function seedMusic(db: Db, bucket: LocalR2Bucket) {
  for (const item of musicSeed) {
    const existing = await db
      .select({ id: music.id })
      .from(music)
      .where(eq(music.title, item.title))
      .limit(1);
    if (existing.length > 0) continue;

    const src = await uploadSeedFile(bucket, "music", item.file);
    const [mediaRow] = await db.insert(media).values({ src, type: "audio" })
      .returning();
    await db.insert(music).values({ title: item.title, audioId: mediaRow.id });
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
  const db = getDb();
  const bucket = await getCdnBucket();
  await seedWorkExperience(db);
  await seedEducation(db, bucket);
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
