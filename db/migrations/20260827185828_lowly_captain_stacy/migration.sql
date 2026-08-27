ALTER TABLE `gallery` ADD `created_at` integer DEFAULT (unixepoch()) NOT NULL;--> statement-breakpoint
ALTER TABLE `projects_to_media` ADD `order` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `releases` ADD `created_at` integer DEFAULT (unixepoch()) NOT NULL;