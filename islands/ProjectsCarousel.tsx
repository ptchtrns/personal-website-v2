import { useEffect, useRef, useState } from "preact/hooks";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  faArrowUpRightFromSquare,
  faChevronLeft,
  faChevronRight,
  faImages,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";
import { FaIcon } from "@/components/icon.tsx";
import type { ProjectItem } from "@/lib/projects.ts";
import { getLinkLabel } from "@/lib/links.shared.ts";

interface ProjectsCarouselProps {
  projects: ProjectItem[];
}

function mainImage(project: ProjectItem) {
  return project.media.find((item) => item.type === "image");
}

function ProjectModal(
  { project, onOpenChange }: {
    project: ProjectItem;
    onOpenChange: (open: boolean) => void;
  },
) {
  const images = project.media.filter((item) => item.type === "image");
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? null;

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent class="max-w-3xl gap-6">
        {active && (
          <div class="flex flex-col gap-2">
            <img
              src={active.src}
              alt={active.alt ?? project.name}
              class="w-full rounded-lg object-cover max-h-[50vh]"
            />
            {images.length > 1 && (
              <div class="flex gap-2 overflow-x-auto pb-1">
                {images.map((item, index) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setActiveIndex(index)}
                    class={`shrink-0 rounded-md overflow-hidden border-2 ${
                      index === activeIndex
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={item.src}
                      alt={item.alt ?? ""}
                      class="h-14 w-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div class="flex flex-col gap-3">
          <h3 class="text-xl font-bold text-stone-900 dark:text-stone-100">
            {project.name}
          </h3>

          {project.shortOverview && (
            <p class="text-stone-700 dark:text-stone-300">
              {project.shortOverview}
            </p>
          )}

          {project.descriptionHtml && (
            <div
              class="markdown-content text-stone-700 dark:text-stone-300"
              // deno-lint-ignore react-no-danger -- admin-authored markdown, rendered server-side
              dangerouslySetInnerHTML={{ __html: project.descriptionHtml }}
            />
          )}

          {project.changelog && (
            <p class="text-sm text-stone-500 dark:text-stone-400 whitespace-pre-line">
              {project.changelog}
            </p>
          )}

          {project.technologies.length > 0 && (
            <div class="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <Badge key={tech.id} variant="secondary">{tech.name}</Badge>
              ))}
            </div>
          )}

          {project.externalUrl && (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1 w-fit"
            >
              Open the website <FaIcon icon={faArrowUpRightFromSquare} />
            </a>
          )}

          {project.links && project.links.length > 0 && (
            <div class="flex flex-wrap gap-3">
              {project.links.map((link) => (
                <a
                  key={link}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1 w-fit"
                >
                  {getLinkLabel(link)}{" "}
                  <FaIcon icon={faArrowUpRightFromSquare} />
                </a>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const [active, setActive] = useState<ProjectItem | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  function updateScrollability() {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    setCanScrollLeft(scroller.scrollLeft > 1);
    setCanScrollRight(
      scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1,
    );
  }

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    updateScrollability();
    scroller.addEventListener("scroll", updateScrollability);
    globalThis.addEventListener("resize", updateScrollability);
    return () => {
      scroller.removeEventListener("scroll", updateScrollability);
      globalThis.removeEventListener("resize", updateScrollability);
    };
  }, [projects]);

  function scrollByCard(direction: 1 | -1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector<HTMLElement>(
      "[data-slot=project-card]",
    );
    const amount = (card?.offsetWidth ?? 288) + 16;
    scroller.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <div class="relative">
      <div
        ref={scrollerRef}
        class="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project) => {
          const image = mainImage(project);
          return (
            <button
              type="button"
              key={project.id}
              data-slot="project-card"
              onClick={() => setActive(project)}
              class="shrink-0 w-80 sm:w-96 snap-start text-left"
            >
              <Card class="relative overflow-hidden py-0 gap-0 h-full hover:opacity-90 transition-opacity">
                {project.isPinned && (
                  <FaIcon
                    icon={faThumbtack}
                    class="absolute top-2 right-2 z-10 text-stone-100 drop-shadow"
                  />
                )}
                {image
                  ? (
                    <img
                      src={image.src}
                      alt={image.alt ?? project.name}
                      class="w-full aspect-video object-cover"
                      loading="lazy"
                    />
                  )
                  : (
                    <div class="w-full aspect-video flex items-center justify-center bg-stone-100 dark:bg-stone-800 text-stone-400">
                      <FaIcon icon={faImages} class="text-3xl" />
                    </div>
                  )}
                <CardContent class="flex flex-col gap-1.5 py-4">
                  <h3 class="font-bold text-stone-900 dark:text-stone-100">
                    {project.name}
                  </h3>
                  {project.shortOverview && (
                    <p class="text-sm text-stone-700 dark:text-stone-300 line-clamp-2">
                      {project.shortOverview}
                    </p>
                  )}
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      {canScrollLeft && (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => scrollByCard(-1)}
          aria-label="Scroll left"
          class="flex absolute -left-4 top-1/2 -translate-y-1/2 rounded-full"
        >
          <FaIcon icon={faChevronLeft} />
        </Button>
      )}
      {canScrollRight && (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => scrollByCard(1)}
          aria-label="Scroll right"
          class="flex absolute -right-4 top-1/2 -translate-y-1/2 rounded-full"
        >
          <FaIcon icon={faChevronRight} />
        </Button>
      )}

      {active && (
        <ProjectModal
          project={active}
          onOpenChange={() => setActive(null)}
        />
      )}
    </div>
  );
}
