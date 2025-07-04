"use server";

import Question from "@/database/question.model";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { CollectionBaseSchema } from "../validations";
import { NotFoundError } from "../http-errors";
import { Collection } from "@/database";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";

export async function toggleSaveQuestion(
	params: CollectionBaseParams
): Promise<ActionResponse<{ saved: boolean }>> {
	const validationResult = await action({
		params,
		schema: CollectionBaseSchema,
		authorize: true,
	});
	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}
	const { questionId } = validationResult.params!;
	const userId = validationResult.session?.user?.id;
	try {
		const question = await Question.findById(questionId);
		if (!question) throw new NotFoundError("Question");

		const collection = await Collection.findOne({
			question: questionId,
			author: userId,
		});
		if (collection) {
			await Collection.findByIdAndDelete(collection._id);
			revalidatePath(ROUTES.QUESTIONS(questionId));
			return {
				success: true,
				data: {
					saved: false,
				},
			};
		} else {
			await Collection.create({
				question: questionId,
				author: userId,
			});
		}
		revalidatePath(ROUTES.QUESTIONS(questionId));
		return {
			success: true,
			data: {
				saved: true,
			},
		};
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}

export async function hasSavedQuestion(
	params: CollectionBaseParams
): Promise<ActionResponse<{ saved: boolean }>> {
	const validationResult = await action({
		params,
		schema: CollectionBaseSchema,
		authorize: true,
	});
	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}
	const { questionId } = validationResult.params!;
	const userId = validationResult.session?.user?.id;
	try {
		const collection = await Collection.findOne({
			question: questionId,
			author: userId,
		});

		return {
			success: true,
			data: {
				saved: !!collection,
			},
		};
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}
