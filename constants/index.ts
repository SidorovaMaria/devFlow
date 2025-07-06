export const sidebarLinks = [
	{
		imgURL: "/icons/home.svg",
		route: "/",
		label: "Home",
	},
	{
		imgURL: "/icons/users.svg",
		route: "/community",
		label: "Community",
	},
	{
		imgURL: "/icons/star.svg",
		route: "/collection",
		label: "Collections",
	},
	// {
	// 	imgURL: "/icons/suitcase.svg",
	// 	route: "/jobs",
	// 	label: "Find Jobs",
	//Dont need it for now
	// },
	{
		imgURL: "/icons/tag.svg",
		route: "/tags",
		label: "Tags",
	},
	{
		imgURL: "/icons/user.svg",
		route: "/profile",
		label: "Profile",
	},
	{
		imgURL: "/icons/question.svg",
		route: "/ask-question",
		label: "Ask a question",
	},
];

/*Badge Information
Metric  | Bronze | Silver | Gold
--------|------|--------|-------
Questions | 10   | 50     | 100
Answers   | 10   | 50    | 100
Upvotes Q   | 100  | 500    | 1000
Upvotes A   | 100  | 500    | 1000
Views      | 1000 | 5000   | 10000
Reputation | 1000 | 5000   | 10000
Logged In Time | 6 months | 12 months | 24 months
*/

export const BADGE_CRITERIA = {
	QUESTION_COUNT: {
		BRONZE: 10,
		SILVER: 50,
		GOLD: 100,
	},
	ANSWER_COUNT: {
		BRONZE: 10,
		SILVER: 50,
		GOLD: 100,
	},
	UPVOTES_QUESTION: {
		BRONZE: 100,
		SILVER: 500,
		GOLD: 1000,
	},
	UPVOTES_ANSWER: {
		BRONZE: 100,
		SILVER: 500,
		GOLD: 1000,
	},
	VIEWS: {
		BRONZE: 1000,
		SILVER: 5000,
		GOLD: 10000,
	},
	REPUTATION: {
		BRONZE: 1000,
		SILVER: 5000,
		GOLD: 10000,
	},
	LOGGED_IN_SINCE: {
		BRONZE: 6 * 30 * 24 * 60 * 60, // 6 months in seconds
		SILVER: 12 * 30 * 24 * 60 * 60, // 12 months in seconds
		GOLD: 24 * 30 * 24 * 60 * 60, // 24 months in seconds
	},
};
