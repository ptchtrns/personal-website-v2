ALTER TABLE `gallery` ADD `created_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
UPDATE `gallery` SET `created_at` = unixepoch() WHERE `created_at` = 0;--> statement-breakpoint
ALTER TABLE `projects_to_media` ADD `order` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `releases` ADD `created_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
UPDATE `releases` SET `created_at` = unixepoch() WHERE `created_at` = 0;
