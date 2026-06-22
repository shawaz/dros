PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`region` text NOT NULL,
	`location` text NOT NULL,
	`status` text NOT NULL,
	`risk` text NOT NULL,
	`health` real NOT NULL,
	`degrad` real NOT NULL,
	`diff` text NOT NULL,
	`ndvi` real,
	`rainfall` real NOT NULL,
	`moisture` real,
	`ph` real,
	`carbon_soil` real,
	`aridity` real NOT NULL,
	`lstemp` real,
	`area` text NOT NULL,
	`cost` text NOT NULL,
	`timeline` text NOT NULL,
	`water` text NOT NULL,
	`carbon` text NOT NULL,
	`terrain_bg` text NOT NULL,
	`terrain_stroke` text NOT NULL,
	`terrain_fill` text NOT NULL,
	`health_col` text NOT NULL,
	`phases` text NOT NULL,
	`species` text NOT NULL,
	`treatments` text NOT NULL,
	`recs` text NOT NULL,
	`current_step` integer NOT NULL,
	`aoi` text NOT NULL,
	`satellite` text,
	`drone_logs` text NOT NULL,
	`soil` text,
	`microbiome` text,
	`prescription` text,
	`kanban` text NOT NULL,
	`resources` text,
	`biomass` text NOT NULL,
	`dmrv` text NOT NULL,
	`carbon_sequestered_tons` real NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_projects`("id", "name", "region", "location", "status", "risk", "health", "degrad", "diff", "ndvi", "rainfall", "moisture", "ph", "carbon_soil", "aridity", "lstemp", "area", "cost", "timeline", "water", "carbon", "terrain_bg", "terrain_stroke", "terrain_fill", "health_col", "phases", "species", "treatments", "recs", "current_step", "aoi", "satellite", "drone_logs", "soil", "microbiome", "prescription", "kanban", "resources", "biomass", "dmrv", "carbon_sequestered_tons") SELECT "id", "name", "region", "location", "status", "risk", "health", "degrad", "diff", "ndvi", "rainfall", "moisture", "ph", "carbon_soil", "aridity", "lstemp", "area", "cost", "timeline", "water", "carbon", "terrain_bg", "terrain_stroke", "terrain_fill", "health_col", "phases", "species", "treatments", "recs", "current_step", "aoi", "satellite", "drone_logs", "soil", "microbiome", "prescription", "kanban", "resources", "biomass", "dmrv", "carbon_sequestered_tons" FROM `projects`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `__new_projects` RENAME TO `projects`;--> statement-breakpoint
PRAGMA foreign_keys=ON;