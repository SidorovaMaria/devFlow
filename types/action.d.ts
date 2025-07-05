import { IInteractionDoc } from "@/database/interaction.model";
import mongoose from "mongoose";

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
interface createVoteParams {
	targetId: string;
	targetType: "question" | "answer";
	voteType: "upvote" | "downvote";
}
interface UpdateVoteCountParams extends createVoteParams {
	change: 1 | -1;
}

type hasVotedParams = Pick<createVoteParams, "targetId" | "targetType">;
interface HasVotedResponse {
	hasUpVoted: boolean;
	hasDownVoted: boolean;
}

interface CollectionBaseParams {
	questionId: string;
}

interface getUserParams {
	userId: string;
}
interface GetUserQuestionsParams extends Omit<PaginatedSearchParams, "query" | "filter" | "sort"> {
	userId: string;
}
interface GetUserAnswersParams extends PaginatedSearchParams {
	userId: string;
}
interface getUserTagsParams {
	userId: string;
}
interface DeleteQuestionParams {
	questionId: string;
}
interface DeleteAnswerParams {
	answerId: string;
}

interface CreateInteractionParams {
	action: "view" | "upvote" | "downvote" | "bookmark" | "post" | "edit" | "delete" | "search";
	actionId: string;
	authorId: string;
	actionTarget: "question" | "answer";
}

interface UpdateReputationParams {
	interaction: IInteractionDoc;
	session: mongoose.ClientSession;
	performerId: string;
	authorId: string;
}

interface RecommendationParams {
	userId: string;
	query?: string;
	skip: number;
	limit: number;
}

interface JobFilterParams {
	query: string;
	page: string;
}

interface UpdateUserParams {
	name?: string;
	username?: string;
	email?: string;
	image?: string;
	password?: string;
}

interface GlobalSearchParams {
	query: string;
	type: string | null;
}
