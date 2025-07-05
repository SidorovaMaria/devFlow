"use server";

import Answer, { IAnswerDoc } from "@/database/answer.model";
import action from "../handlers/action";
import { AnswerServerSchema, DeleteAnswerSchema, GetAnswersSchema } from "../validations";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import Question from "@/database/question.model";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";
import { Vote } from "@/database";
import { createAnswerParams, DeleteAnswerParams, getAnswersParams } from "@/types/action";
import { after } from "next/server";
import { createInteraction } from "./interactions.action";
export async function createAnswer(
	params: createAnswerParams
): Promise<ActionResponse<IAnswerDoc>> {
	const validatedResult = await action({
		params,
		schema: AnswerServerSchema,
		authorize: true,
	});
	if (validatedResult instanceof Error) {
		return handleError(validatedResult) as ErrorResponse;
	}
	const { content, questionId } = validatedResult.params!;

	const userId = validatedResult?.session?.user?.id;
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const question = await Question.findById(questionId).session(session);
		if (!question) {
			throw new NotFoundError("Question");
		}
		const [newAnswer] = await Answer.create(
			[
				{
					author: userId,
					question: questionId,
					content,
				},
			],
			{ session }
		);
		if (!newAnswer) {
			throw new Error("Failed to create answer");
		}
		question.answers += 1;
		await question.save({ session });
		await session.commitTransaction();
		after(async () => {
			const { success } = await createInteraction({
				action: "post",
				actionTarget: "answer",
				actionId: newAnswer._id.toString(),
				authorId: userId as string,
			});
			if (!success) {
				console.error("Failed to create interaction for answer post");
			}
		});
		revalidatePath(ROUTES.QUESTIONS(questionId));
		return {
			success: true,
			data: JSON.parse(JSON.stringify(newAnswer)),
		};
	} catch (error) {
		await session.abortTransaction();
		return handleError(error) as ErrorResponse;
	} finally {
		session.endSession();
	}
}

export async function getAnswers(params: getAnswersParams): Promise<
	ActionResponse<{
		answers: Answer[];
		isNext: boolean;
		totalAnswers: number;
	}>
> {
	const validatedResult = await action({
		params,
		schema: GetAnswersSchema,
	});
	if (validatedResult instanceof Error) {
		return handleError(validatedResult) as ErrorResponse;
	}
	const { questionId, page = 1, pageSize = 10, filter } = validatedResult.params!;
	const skip = (Number(page) - 1) * pageSize;
	const limit = Number(pageSize);
	let sortCriteria = {};
	switch (filter) {
		case "latest":
			sortCriteria = { createdAt: -1 };
			break;
		case "oldest":
			sortCriteria = { createdAt: 1 };
			break;
		case "popular":
			sortCriteria = { upvotes: -1 };
			break;
		default:
			sortCriteria = { createdAt: -1 }; // Default to latest
			break;
	}
	try {
		const totalAnswers = await Answer.countDocuments({
			question: questionId,
		});
		const answers = await Answer.find({
			question: questionId,
		})
			.populate("author", "_id name image")
			.sort(sortCriteria)
			.skip(skip)
			.limit(limit);
		const isNext = totalAnswers > skip + limit;
		return {
			success: true,
			data: {
				answers: JSON.parse(JSON.stringify(answers)),
				isNext,
				totalAnswers,
			},
		};
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}

export async function deleteAnswer(params: DeleteAnswerParams): Promise<ActionResponse> {
	const validatedResult = await action({
		params,
		schema: DeleteAnswerSchema,
		authorize: true,
	});
	if (validatedResult instanceof Error) {
		return handleError(validatedResult) as ErrorResponse;
	}
	const { answerId } = validatedResult.params!;
	const { user } = validatedResult.session!;
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const answer = await Answer.findById(answerId).session(session);
		if (!answer) {
			throw new NotFoundError("Answer");
		}
		if (answer.author.toString() !== user?.id) {
			throw new UnauthorizedError("You are not authorized to delete this answer.");
		}
		const question = await Question.findById(answer.question).session(session);
		if (!question) {
			throw new NotFoundError("Question");
		}
		// reduce the question answers count
		await Question.findByIdAndUpdate(
			answer.question,
			{ $inc: { answers: -1 } },
			{ new: true, session }
		);
		if (question.upvotes > 0 || question.downvotes > 0) {
			await Vote.deleteMany({
				targetId: answerId,
				targetType: "answer",
			}).session(session);
		}
		await Answer.findByIdAndDelete(answerId, { session });
		after(async () => {
			const { success } = await createInteraction({
				action: "delete",
				actionTarget: "answer",
				actionId: answerId,
				authorId: user?.id as string,
			});
			if (!success) {
				console.error("Failed to create interaction for answer deletion");
			}
		});
		await session.commitTransaction();
		user?.id && revalidatePath(ROUTES.PROFILE(user?.id));
		return {
			success: true,
		};
	} catch (error) {
		await session.abortTransaction();
		return handleError(error) as ErrorResponse;
	} finally {
		session.endSession();
	}
}
