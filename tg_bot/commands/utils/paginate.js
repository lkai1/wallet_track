export const paginate = (array, page, perPage) => {
	const start = page * perPage;
	return array.slice(start, start + perPage);
};