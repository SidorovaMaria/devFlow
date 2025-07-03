"use server";

import Answer, { IAnswerDoc } from "@/database/answer.model";
import action from "../handlers/action";
import { AnswerServerSchema } from "../validations";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import Question from "@/database/question.model";
import { NotFoundError } from "../http-errors";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";

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
