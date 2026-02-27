export interface TagLink {
	text: string;
	url?: string;
}

export interface ProjectData {
	id: string;
	title: string;
	subtitle: string;
	tags?: TagLink[];
	aspect: number;
	previewImage: string;
	previewVideo?: string;
	description: string;
	descriptionParagraphs?: string[];
	iconPath: string;
}

export interface AllProjectData {
	projects: ProjectData[];
}