export interface ProjectData {
	id: string;
	title: string;
	subtitle: string;
	aspect: number;
	previewImages?: string[];
	previewVideo?: string;
	description: string;
	descriptionParagraphs?: string[];
	iconPath: string;
}

export interface AllProjectData {
	projects: ProjectData[];
}