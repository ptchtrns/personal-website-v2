import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import MediaAdmin from "@/islands/MediaAdmin.tsx";
import GalleryAdmin from "@/islands/GalleryAdmin.tsx";
import MusicAdmin from "@/islands/MusicAdmin.tsx";
import EducationAdmin from "@/islands/EducationAdmin.tsx";
import WorkExperienceAdmin from "@/islands/WorkExperienceAdmin.tsx";
import ProjectsAdmin from "@/islands/ProjectsAdmin.tsx";

export default function AdminTabs() {
  return (
    <Tabs defaultValue="media">
      <TabsList>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="gallery">Gallery</TabsTrigger>
        <TabsTrigger value="music">Music</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="work-experience">Work experience</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
      </TabsList>
      <TabsContent value="media">
        <MediaAdmin />
      </TabsContent>
      <TabsContent value="gallery">
        <GalleryAdmin />
      </TabsContent>
      <TabsContent value="music">
        <MusicAdmin />
      </TabsContent>
      <TabsContent value="education">
        <EducationAdmin />
      </TabsContent>
      <TabsContent value="work-experience">
        <WorkExperienceAdmin />
      </TabsContent>
      <TabsContent value="projects">
        <ProjectsAdmin />
      </TabsContent>
    </Tabs>
  );
}
