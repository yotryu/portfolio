import type { PageLoad } from './$types';
import * as Types from '$lib/types';


export const load: PageLoad = async ({ fetch, params }) => {
	// Fetch our post json
	let path = `/projects.json`;
	let rawJson = await fetch(path);
	let json = await rawJson.json() as Types.AllProjectData;
	let pageData = json.projects.find(i => i.id == params.slug);

	// generate paragraphs
	if (pageData)
	{
		pageData.descriptionParagraphs = pageData?.description.split('\n');
	}

	// Return post and collection information
	return pageData;
};