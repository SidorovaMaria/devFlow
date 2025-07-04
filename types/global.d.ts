interface Tag {
	_id: string;
	name: string;
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
}
