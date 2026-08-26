import { page } from "fresh";
import { define } from "../utils.ts";
import { MainDisplay } from "@/components/layout/MainDisplay.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { ArrowUpRightFromSquareIcon } from "@/components/icons.tsx";
import { getLinkLabel } from "@/lib/links.shared.ts";
import { type EducationItem, listEducation } from "@/lib/education.ts";
import { listAllProjects, type ProjectItem } from "@/lib/projects.ts";
import {
  listWorkExperience,
  type WorkExperienceItem,
} from "@/lib/work-experience.ts";
import ProjectsCarousel from "@/islands/ProjectsCarousel.tsx";

interface HomeData {
  workExperience: WorkExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  error: string | null;
}

function formatDateRange(startedAt: Date, finishedAt: Date | null): string {
  const format = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  return `${format(startedAt)} – ${
    finishedAt ? format(finishedAt) : "Present"
  }`;
}

export const handler = define.handlers({
  async GET(): Promise<ReturnType<typeof page<HomeData>>> {
    try {
      const [workExperience, education, projects] = await Promise.all([
        listWorkExperience(),
        listEducation(),
        listAllProjects(),
      ]);
      return page({ workExperience, education, projects, error: null });
    } catch (error) {
      console.error("Failed to load homepage data", error);
      return page({
        workExperience: [],
        education: [],
        projects: [],
        error: "Failed to load homepage data",
      });
    }
  },
});

export default define.page<typeof handler>(function Home({ data }) {
  const { workExperience, education, projects, error } = data;

  return (
    <MainDisplay>
      <div class="flex flex-col gap-8">
        <section class="flex flex-col gap-3">
          <h1 class="text-4xl font-bold dark:text-stone-100">
            Nikolai Zakharov
          </h1>
          <p class="text-lg leading-relaxed text-stone-700 dark:text-stone-300">
            &#x1F1EB;&#x1F1EE; Espoo, Finland
          </p>
          <p class="text-lg leading-relaxed text-stone-700 dark:text-stone-300">
            Software Development student with solid experience in different
            programming languages and frameworks, gained through practical work
            on various projects.
          </p>
        </section>

        {error && <p class="text-red-600 dark:text-red-400">{error}</p>}

        {projects.length > 0 && (
          <section class="flex flex-col gap-6">
            <h2 class="text-2xl font-bold text-stone-900 dark:text-stone-100">
              Projects
            </h2>
            <ProjectsCarousel projects={projects} />
          </section>
        )}

        {workExperience.length > 0 && (
          <section class="flex flex-col gap-6">
            <h2 class="text-2xl font-bold text-stone-900 dark:text-stone-100">
              Work Experience
            </h2>
            {workExperience.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle>{job.jobTitle}</CardTitle>
                  <CardDescription>
                    {formatDateRange(job.startedAt, job.finishedAt)} ·{" "}
                    {job.companyUrl
                      ? (
                        <a
                          href={job.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-blue-700 dark:text-blue-400 hover:underline"
                        >
                          {job.companyName}{" "}
                          <ArrowUpRightFromSquareIcon class="text-xs" />
                        </a>
                      )
                      : job.companyName}
                  </CardDescription>
                  {job.logoSrc && (
                    <CardAction>
                      <img
                        src={job.logoSrc}
                        alt=""
                        class="h-10 w-10 object-cover rounded"
                      />
                    </CardAction>
                  )}
                </CardHeader>
                {(job.descriptionHtml || job.links?.length) && (
                  <CardContent class="flex flex-col gap-3">
                    {job.descriptionHtml && (
                      <div
                        class="markdown-content text-stone-700 dark:text-stone-300"
                        // deno-lint-ignore react-no-danger -- admin-authored markdown, rendered server-side
                        dangerouslySetInnerHTML={{
                          __html: job.descriptionHtml,
                        }}
                      />
                    )}
                    {job.links && job.links.length > 0 && (
                      <div class="flex flex-wrap gap-3">
                        {job.links.map((link) => (
                          <a
                            key={link}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1 text-sm"
                          >
                            {getLinkLabel(link)}{" "}
                            <ArrowUpRightFromSquareIcon class="text-xs" />
                          </a>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section class="flex flex-col gap-6">
            <h2 class="text-2xl font-bold text-stone-900 dark:text-stone-100">
              Education
            </h2>
            {education.map((item) => (
              <Card key={item.id}>
                <CardContent class="flex flex-row gap-6 items-center">
                  {item.logoSrc && (
                    <img
                      src={item.logoSrc}
                      alt={`${item.educationInstitution} Logo`}
                      class="w-16 md:w-24 my-2"
                    />
                  )}
                  <div class="flex flex-col gap-2">
                    <h3 class="text-xl font-bold text-stone-900 dark:text-stone-100">
                      {item.degreeTitle}
                    </h3>
                    <span class="text-stone-700 dark:text-stone-300">
                      {item.educationInstitution},{" "}
                      {formatDateRange(item.startedAt, item.finishedAt)}
                    </span>
                    {item.links && item.links.length > 0 && (
                      <div class="flex flex-wrap gap-3">
                        {item.links.map((link) => (
                          <a
                            key={link}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1 text-sm"
                          >
                            {getLinkLabel(link)}{" "}
                            <ArrowUpRightFromSquareIcon class="text-xs" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </div>
    </MainDisplay>
  );
});
