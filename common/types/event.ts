export type EventOnPoster = {
	id: string;
	creatorId?: string;
	title: string;
	description: string;
	date: number;
	durationInSeconds: number;
	location: {
		country: string;
		city: string;
	};
	image: string;
	price: number;
	timezone?: {
		timezoneName: string;
		timezoneOffset: string;
	};
	url: string;
};

export type PostEventPayload = {
	event: {
		date: number;
		image: string;
		durationInSeconds: number;
		price: number;
		timezone: {
			timezoneOffset: string;
			timezoneName: string;
		};
		description: string;
		location: { country: string; city: string };
		title: string;
		url: string;
	};
};

export type EventParams = {
	id: string;
};

export type SearchEventPayload = {
	searchLine?: string;
	country?: string;
	city?: string;
};
