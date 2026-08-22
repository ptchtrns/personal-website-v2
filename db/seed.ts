import { and, eq } from "drizzle-orm";
import { getDb } from "@/db/local-client.ts";
import { education, projects, workExperience } from "@/db/schema.ts";

type Db = ReturnType<typeof getDb>;

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

const educationSeed: (typeof education.$inferInsert)[] = [
  {
    degreeTitle:
      "Information and Communication Technology - Bachelor's degree (In Progress)",
    degreeType: "Bachelor's degree",
    educationInstitution: "Metropolia University of Applied Sciences",
    institutionLogoSrc: "/img/metropolia_logo.png",
    startedAt: new Date("2025-08-01T00:00:00Z"),
    finishedAt: null,
  },
  {
    degreeTitle: "Software Engineering - Vocational undergraduate degree",
    degreeType: "Vocational undergraduate degree",
    educationInstitution: "Salpaus Further Education",
    institutionLogoSrc: "/img/salpaus_logo.png",
    startedAt: new Date("2023-01-01T00:00:00Z"),
    finishedAt: new Date("2025-06-01T00:00:00Z"),
  },
];

const projectsSeed: (typeof projects.$inferInsert)[] = [
  {
    name: "SimPictures",
    description: [
      "Social media platform for sharing flight simulator screenshots.",
      "Built with Next.js and PostgreSQL. ASP.NET, multiple AWS services (s3, CloudFront, App Runner, ECR, Rekognition), Vercel, Discord.Net and Appsmith are also utilized.",
      "Implemented account management, image upload and processing, custom UI design and components.",
      "To be open-sourced in 2026.",
    ],
    logoSrc: "/img/simpictures_logo.svg",
    externalUrl: "https://www.simpictures.com/",
    isPinned: true,
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

async function seedEducation(db: Db) {
  for (const row of educationSeed) {
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
    await db.insert(education).values(row);
  }
}

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

async function main() {
  const db = getDb();
  await seedWorkExperience(db);
  await seedEducation(db);
  await seedProjects(db);
  console.log("Seed complete.");
}

if (import.meta.main) {
  await main();
}
