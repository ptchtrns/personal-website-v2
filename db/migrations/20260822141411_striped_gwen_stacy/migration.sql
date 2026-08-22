ALTER TABLE `education` ADD `institution_logo_src` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `logo_src` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `external_url` text;--> statement-breakpoint
ALTER TABLE `work_experience` ADD `company_url` text;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_education` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`degree_title` text NOT NULL,
	`degree_type` text NOT NULL,
	`education_institution` text NOT NULL,
	`institution_logo_src` text,
	`started_at` integer NOT NULL,
	`finished_at` integer,
	`description` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_education`(`id`, `degree_title`, `degree_type`, `education_institution`, `started_at`, `finished_at`, `description`, `created_at`) SELECT `id`, `degree_title`, `degree_type`, `education_institution`, `started_at`, `finished_at`, `description`, `created_at` FROM `education`;--> statement-breakpoint
DROP TABLE `education`;--> statement-breakpoint
ALTER TABLE `__new_education` RENAME TO `education`;--> statement-breakpoint
PRAGMA foreign_keys=ON;