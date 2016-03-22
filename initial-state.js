const state = {
	step: 0,
	pullRequests: {
		items: [],
		isLoading: true,
	},
	patch: {
		pr: null,
		diff: '',
	},
	trac: {
		base: 'https://core.trac.wordpress.org',
		ticket: null,
		username: '',
		password: '',
		state: 'waiting',
	},
	uploader: {
		state: 'waiting',
		data: null,
	},
};

export default state;
