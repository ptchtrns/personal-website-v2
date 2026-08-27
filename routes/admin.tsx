import { z } from "zod";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { define } from "../utils.ts";
import { optionalIntId, queryFlag } from "@/lib/validation.ts";
import { MainDisplay } from "@/components/layout/MainDisplay.tsx";
import { AdminNav } from "@/components/admin/AdminNav.tsx";
import { FormMessage } from "@/components/admin/FormMessage.tsx";
import { Button } from "@/components/ui/button.tsx";
import { FaIcon } from "@/components/icon.tsx";
import GalleryAdmin from "@/components/admin/GalleryAdmin.tsx";
import MusicAdmin from "@/components/admin/MusicAdmin.tsx";
import EducationAdmin from "@/components/admin/EducationAdmin.tsx";
import WorkExperienceAdmin from "@/components/admin/WorkExperienceAdmin.tsx";
import ProjectsAdmin from "@/components/admin/ProjectsAdmin.tsx";
import MediaAdmin from "@/components/admin/MediaAdmin.tsx";
import SiteSettingsAdmin from "@/components/admin/SiteSettingsAdmin.tsx";
import { listGallery } from "@/lib/gallery.ts";
import { listReleases } from "@/lib/releases.ts";
import { listEducation } from "@/lib/education.ts";
import { listWorkExperience } from "@/lib/work-experience.ts";
import { listAllProjects } from "@/lib/projects.ts";
import { listTechnologies } from "@/lib/technologies.ts";
import { listMedia, type MediaItem } from "@/lib/media.ts";
import { listSiteSettings } from "@/lib/site-settings.ts";
import type { GalleryItem } from "@/lib/gallery.ts";
import type { ReleaseItem } from "@/lib/releases.ts";
import type { EducationItem } from "@/lib/education.ts";
import type { WorkExperienceItem } from "@/lib/work-experience.ts";
import type { ProjectItem } from "@/lib/projects.ts";
import type { Technology } from "@/lib/technologies.ts";
import type { SiteSetting } from "@/lib/site-settings.ts";

const TABS = [
  "media",
  "gallery",
  "music",
  "education",
  "work-experience",
  "projects",
  "site-settings",
] as const;
type Tab = typeof TABS[number];

const querySchema = z.object({
  tab: z.enum(TABS).catch("media"),
  edit: optionalIntId("Invalid edit id"),
  new: queryFlag,
  confirmDelete: queryFlag,
  trackEdit: optionalIntId("Invalid track edit id"),
  trackNew: optionalIntId("Invalid track new id"),
  trackConfirmDelete: queryFlag,
  settingsEdit: z.preprocess((v) => v ?? null, z.string().nullable()),
  error: z.preprocess((v) => v ?? null, z.string().nullable()),
  ok: z.preprocess((v) => v ?? null, z.string().nullable()),
});

interface AdminData {
  tab: Tab;
  error: string | null;
  ok: string | null;
  gallery?: {
    items: GalleryItem[];
    images: MediaItem[];
    editId: number | null;
    isNew: boolean;
    confirmDelete: boolean;
  };
  music?: {
    releases: ReleaseItem[];
    images: MediaItem[];
    audio: MediaItem[];
    editId: number | null;
    isNew: boolean;
    confirmDelete: boolean;
    trackEditId: number | null;
    trackNewReleaseId: number | null;
    trackConfirmDelete: boolean;
  };
  education?: {
    items: EducationItem[];
    images: MediaItem[];
    editId: number | null;
    isNew: boolean;
    confirmDelete: boolean;
  };
  workExperience?: {
    items: WorkExperienceItem[];
    images: MediaItem[];
    editId: number | null;
    isNew: boolean;
    confirmDelete: boolean;
  };
  projects?: {
    items: ProjectItem[];
    images: MediaItem[];
    technologies: Technology[];
    editId: number | null;
    isNew: boolean;
    confirmDelete: boolean;
  };
  media?: {
    items: MediaItem[];
    deleteId: number | null;
    isNew: boolean;
    confirmDelete: boolean;
  };
  siteSettings?: {
    items: SiteSetting[];
    editKey: string | null;
    isNew: boolean;
    confirmDelete: boolean;
  };
}

export const handler = define.handlers({
  async GET(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

    const url = new URL(ctx.req.url);
    const {
      tab,
      edit: editId,
      new: isNew,
      confirmDelete,
      trackEdit: trackEditId,
      trackNew: trackNewReleaseId,
      trackConfirmDelete,
      settingsEdit,
      error,
      ok,
    } = querySchema.parse(Object.fromEntries(url.searchParams));

    const common = { tab, error, ok };

    switch (tab) {
      case "gallery": {
        const [items, images] = await Promise.all([
          listGallery(),
          listMedia("image"),
        ]);
        const data: AdminData = {
          ...common,
          gallery: { items, images, editId, isNew, confirmDelete },
        };
        return { data };
      }
      case "music": {
        const [releases, images, audio] = await Promise.all([
          listReleases(),
          listMedia("image"),
          listMedia("audio"),
        ]);
        const data: AdminData = {
          ...common,
          music: {
            releases,
            images,
            audio,
            editId,
            isNew,
            confirmDelete,
            trackEditId,
            trackNewReleaseId,
            trackConfirmDelete,
          },
        };
        return { data };
      }
      case "education": {
        const [items, images] = await Promise.all([
          listEducation(),
          listMedia("image"),
        ]);
        const data: AdminData = {
          ...common,
          education: { items, images, editId, isNew, confirmDelete },
        };
        return { data };
      }
      case "work-experience": {
        const [items, images] = await Promise.all([
          listWorkExperience(),
          listMedia("image"),
        ]);
        const data: AdminData = {
          ...common,
          workExperience: { items, images, editId, isNew, confirmDelete },
        };
        return { data };
      }
      case "projects": {
        const [items, images, technologies] = await Promise.all([
          listAllProjects(),
          listMedia("image"),
          listTechnologies(),
        ]);
        const data: AdminData = {
          ...common,
          projects: {
            items,
            images,
            technologies,
            editId,
            isNew,
            confirmDelete,
          },
        };
        return { data };
      }
      case "site-settings": {
        const items = await listSiteSettings();
        const data: AdminData = {
          ...common,
          siteSettings: { items, editKey: settingsEdit, isNew, confirmDelete },
        };
        return { data };
      }
      case "media":
      default: {
        const items = await listMedia();
        const data: AdminData = {
          ...common,
          media: { items, deleteId: editId, isNew, confirmDelete },
        };
        return { data };
      }
    }
  },
});

export default define.page<typeof handler>(function Admin({ data }) {
  return (
    <MainDisplay>
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between gap-4">
          <AdminNav active={data.tab} />
          <form method="POST" action="/api/logout">
            <Button type="submit" variant="outline" size="sm">
              <FaIcon icon={faRightFromBracket} />
              Log out
            </Button>
          </form>
        </div>
        <FormMessage error={data.error} ok={data.ok} />
        {data.tab === "media" && data.media && <MediaAdmin {...data.media} />}
        {data.tab === "gallery" && data.gallery && (
          <GalleryAdmin {...data.gallery} />
        )}
        {data.tab === "music" && data.music && <MusicAdmin {...data.music} />}
        {data.tab === "education" && data.education && (
          <EducationAdmin {...data.education} />
        )}
        {data.tab === "work-experience" && data.workExperience && (
          <WorkExperienceAdmin {...data.workExperience} />
        )}
        {data.tab === "projects" && data.projects && (
          <ProjectsAdmin {...data.projects} />
        )}
        {data.tab === "site-settings" && data.siteSettings && (
          <SiteSettingsAdmin {...data.siteSettings} />
        )}
      </div>
    </MainDisplay>
  );
});
