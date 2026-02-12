ALTER TABLE `movies_db`.`movies` 
ADD COLUMN `slug` VARCHAR(255) NULL AFTER `updated_at`,
AFTER `id`
ADD UNIQUE INDEX `slug_UNIQUE` (`slug` ASC) VISIBLE;
;
