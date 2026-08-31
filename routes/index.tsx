import { page } from "fresh";
import { define } from "../utils.ts";
import { MainDisplay } from "@/components/layout/MainDisplay.tsx";
import { listAllProjects, type ProjectItem } from "@/lib/projects.ts";
import { getSiteSetting } from "@/lib/site-settings.ts";
import { markdownToHtml } from "@/lib/markdown.ts";
import ProjectsCarousel from "@/islands/ProjectsCarousel.tsx";

const DEFAULT_DESCRIPTION =
  "Software Development student with solid experience in different " +
  "programming languages and frameworks, gained through practical work " +
  "on various projects.";

interface HomeData {
  projects: ProjectItem[];
  descriptionHtml: string;
  error: string | null;
}

export const handler = define.handlers({
  async GET(): Promise<ReturnType<typeof page<HomeData>>> {
    try {
      const [projects, description] = await Promise.all([
        listAllProjects(),
        getSiteSetting("home_description"),
      ]);
      return page({
        projects,
        descriptionHtml: markdownToHtml(description ?? DEFAULT_DESCRIPTION)!,
        error: null,
      });
    } catch (error) {
      console.error("Failed to load homepage data", error);
      return page({
        projects: [],
        descriptionHtml: markdownToHtml(DEFAULT_DESCRIPTION)!,
        error: "Failed to load homepage data",
      });
    }
  },
});

export default define.page<typeof handler>(function Home({ data }) {
  const { projects, descriptionHtml, error } = data;

  return (
    <MainDisplay>
      <div class="flex flex-col gap-8">
        <section class="flex flex-col gap-3">
          <h1 class="text-4xl font-bold dark:text-zinc-100">
            Nikolai Zakharov
          </h1>
          <p class="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
            &#x1F1EB;&#x1F1EE; Espoo, Finland
          </p>
          <div
            class="markdown-content text-lg leading-relaxed text-zinc-700 dark:text-zinc-300"
            // deno-lint-ignore react-no-danger -- admin-authored markdown, rendered server-side
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        </section>

        {error && <p class="text-red-600 dark:text-red-400">{error}</p>}

        {projects.length > 0 && (
          <section class="flex flex-col gap-6">
            <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Projects
            </h2>
            <ProjectsCarousel projects={projects} />
          </section>
        )}
      </div>
    </MainDisplay>
  );
});
