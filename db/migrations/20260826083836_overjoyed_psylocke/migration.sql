ALTER TABLE `education` ADD `institution_logo_id` integer REFERENCES media(id) ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE `work_experience` ADD `company_logo_id` integer REFERENCES media(id) ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE `education` DROP COLUMN `institution_logo_src`;--> statement-breakpoint
ALTER TABLE `work_experience` DROP COLUMN `company_logo_src`;