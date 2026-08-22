CREATE TABLE `education` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`degree_title` text NOT NULL,
	`degree_type` text NOT NULL,
	`education_institution` text NOT NULL,
	`started_at` integer NOT NULL,
	`finished_at` integer NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gallery` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`description` text,
	`image_id` integer NOT NULL,
	CONSTRAINT `fk_gallery_image_id_media_id_fk` FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`src` text NOT NULL,
	`type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `music` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL,
	`audio_id` integer NOT NULL,
	`cover_id` integer,
	CONSTRAINT `fk_music_audio_id_media_id_fk` FOREIGN KEY (`audio_id`) REFERENCES `media`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_music_cover_id_media_id_fk` FOREIGN KEY (`cover_id`) REFERENCES `media`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`description` text,
	`changelog` text,
	`short_overview` text,
	`is_pinned` integer DEFAULT false NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects_to_media` (
	`project_id` integer NOT NULL,
	`media_id` integer NOT NULL,
	CONSTRAINT `projects_to_media_pk` PRIMARY KEY(`project_id`, `media_id`),
	CONSTRAINT `fk_projects_to_media_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_projects_to_media_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `projects_to_technologies` (
	`project_id` integer NOT NULL,
	`technology_id` integer NOT NULL,
	CONSTRAINT `projects_to_technologies_pk` PRIMARY KEY(`project_id`, `technology_id`),
	CONSTRAINT `fk_projects_to_technologies_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_projects_to_technologies_technology_id_technologies_id_fk` FOREIGN KEY (`technology_id`) REFERENCES `technologies`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `technologies` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL UNIQUE,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `work_experience` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`job_title` text NOT NULL,
	`company_name` text NOT NULL,
	`started_at` integer NOT NULL,
	`finished_at` integer,
	`company_logo_src` text,
	`description` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
