interface Tag {
	_id: string;
	name: string;
	questions?: number;
}
interface Author {
	_id: string;
	name: string;
	image: string;
}
interface Question {
	_id: string;
	title: string;
	content: string;
	description: string;
	tags: Tag[];
	author: Author;
	upvotes: number;
	downvotes: number;
	answers: number;
	views: number;
	createdAt: Date;
}

type ActionResponse<T = null> = {
	success: booleam;
	data?: T;
	error?: {
		message: string;
		details?: Record<string, string[]>;
	};

	status?: number;
};
type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };
type APIErrorrResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface RouteParams {
	params: Promise<Record<string, string>>;
	searchParams: Promise<Record<string, string>>;
}

interface PaginatedSearchParams {
	page?: number;
	pageSize?: number;
	query?: string;
	sort?: string;
	filter?: string;
}
interface Answer {
	_id: string;
	author: Author;
	content: string;
	createdAt: Date;
	upvotes: number;
	downvotes: number;
	quesiton: string;
}
//Data that othrers can see
interface User {
	_id: string;
	username: string;
	name: string;
	email: string;
	bio?: string;
	image?: string;
	location?: string;
	portfolio?: string;
	reputation?: number;
	createdAt?: Date;
}

interface Collection {
	_id: string;
	question: Question;
	author: Author | string;
}

interface Badges {
	GOLD: number;
	SILVER: number;
	BRONZE: number;
}

/*
Badge Information
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

interface Job {
	job_id: srting;
	employer_name?: string;
	employer_logo?: string | undefined;
	employer_website?: string;
	job_employment_type?: string;
	job_title?: string;
	job_description?: string;
	job_apply_link?: string;
	job_city?: string;
	job_state?: string;
	job_country?: string;
}
interface Country {
	name: {
		common: string;
	};
}
