CREATE TABLE `releases` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`cover_id` integer,
	CONSTRAINT `fk_releases_cover_id_media_id_fk` FOREIGN KEY (`cover_id`) REFERENCES `media`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
CREATE TABLE `tracks` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL,
	`audio_id` integer NOT NULL,
	`release_id` integer NOT NULL,
	CONSTRAINT `fk_tracks_audio_id_media_id_fk` FOREIGN KEY (`audio_id`) REFERENCES `media`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_tracks_release_id_releases_id_fk` FOREIGN KEY (`release_id`) REFERENCES `releases`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
DROP TABLE `music`;