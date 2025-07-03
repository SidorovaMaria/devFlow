interface SignInWithOAuthParams {
	user: {
		email: string;
		name: string;
		username: string;
		image: string;
	};
	provider: "google" | "github";
	providerAccountId: string;
}

interface AuthCredentials {
	name: string;
	username: string;
	email: string;
	password: string;
}

interface CreateQuestionParams {
	title: string;
	content: string;
	tags: string[];
}
interface EditQustionParams extends CreateQuestionParams {
	questionId: string;
}
interface getQuestionParams {
	questionId: string;
}
interface getTagQuestionsParams extends Omit<PaginatedSearchParams, "filter"> {
	tagId: string;
}
interface incrementViewsParams {
	questionId: string;
}
interface createAnswerParams {
	questionId: string;
	content: string;
}
interface getAnswersParams extends PaginatedSearchParams {
	questionId: string;
}
