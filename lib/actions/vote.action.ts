"use server";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import { CreateVoteSchema, hasVotedSchema, UpdateVoteCountSchema } from "../validations";
import mongoose, { ClientSession } from "mongoose";
import { Answer, Vote } from "@/database";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";

export async function updateVoteCount(
	params: UpdateVoteCountParams,
	session?: ClientSession
): Promise<ActionResponse> {
	const vlaidationResult = await action({
		params,
		schema: UpdateVoteCountSchema,
		authorize: true,
	});
	if (vlaidationResult instanceof Error) {
		return handleError(vlaidationResult) as ErrorResponse;
	}
	const { targetId, targetType, voteType, change } = vlaidationResult.params!;
	const Model = targetType === "question" ? Question : Answer;
	const voteField = voteType === "upvote" ? "upvotes" : "downvotes";
	try {
		const result = await Model.findByIdAndUpdate(
			targetId,
			{ $inc: { [voteField]: change } },
			{ new: true, session }
		);
		if (!result) throw new Error("Failed to update vote count");
		return {
			success: true,
		};
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}

export async function createVote(params: createVoteParams): Promise<ActionResponse> {
	const validationResult = await action({ params, schema: CreateVoteSchema, authorize: true });
	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}
	const { targetId, targetType, voteType } = validationResult.params!;
	const userId = validationResult?.session?.user?.id;
	if (!userId) {
		return handleError(
			new UnauthorizedError("You need to be logged in to vote.")
		) as ErrorResponse;
	}

	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const existingVote = await Vote.findOne({
			author: userId,
			actionId: targetId,
			actionType: targetType,
		}).session(session);

		if (existingVote) {
			if (existingVote.voteType === voteType) {
				// If the vote type is the same, remove the vote
				await Vote.deleteOne({
					_id: existingVote._id,
				}).session(session);
				await updateVoteCount(
					{
						targetId,
						targetType,
						voteType,
						change: -1,
					},
					session
				);
			} else {
				// If user is changing their vote, update voteType and adjust counts
				await Vote.findByIdAndUpdate(
					existingVote._id,
					{ voteType },
					{ new: true, session }
				);
				await updateVoteCount(
					{
						targetId,
						targetType,
						voteType: existingVote.voteType,
						change: -1,
					},
					session
				);
				await updateVoteCount(
					{
						targetId,
						targetType,
						voteType,
						change: 1,
					},
					session
				);
			}
		} else {
			await Vote.create(
				[
					{
						author: userId,
						actionId: targetId,
						actionType: targetType,
						voteType,
					},
				],
				{ session }
			);
			await updateVoteCount({ targetId, targetType, voteType, change: 1 }, session);
		}
		revalidatePath(ROUTES.QUESTIONS(targetId));
		await session.commitTransaction();

		return { success: true };
	} catch (error) {
		await session.abortTransaction();
		return handleError(error) as ErrorResponse;
	} finally {
		await session.endSession();
	}
}

export async function hasVoted(params: hasVotedParams): Promise<ActionResponse<HasVotedResponse>> {
	const validationResult = await action({
		params,
		schema: hasVotedSchema,
		authorize: true,
	});
	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}
	const { targetId, targetType } = validationResult.params!;
	const userId = validationResult?.session?.user?.id;
	if (!userId) {
		return handleError(
			new UnauthorizedError("You need to be logged in to check vote status.")
		) as ErrorResponse;
	}
	try {
		const vote = await Vote.findOne({
			author: userId,
			actionId: targetId,
			actionType: targetType,
		});
		if (!vote) {
			return {
				success: false,
				data: {
					hasUpVoted: false,
					hasDownVoted: false,
				},
			};
		}
		return {
			success: true,
			data: {
				hasUpVoted: vote.voteType === "upvote",
				hasDownVoted: vote.voteType === "downvote",
			},
		};
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}
