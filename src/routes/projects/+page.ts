import type { PageLoad } from './$types';
import * as Types from '$lib/types';


export const load: PageLoad = async ({ fetch }) => {
	// Fetch our post json
	let path = `/projects.json`;
	let rawJson = await fetch(path);
	let json = await rawJson.json() as Types.AllProjectData;

	// Return post and collection information
	return json;
};