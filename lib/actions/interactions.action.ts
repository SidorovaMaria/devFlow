import Interaction, { IInteractionDoc } from "@/database/interaction.model";
import handleError from "../handlers/error";
import { CreateInteractionSchema } from "../validations";
import action from "../handlers/action";
import mongoose from "mongoose";
import { CreateInteractionParams, UpdateReputationParams } from "@/types/action";
import { User } from "@/database";

export async function createInteraction(
	params: CreateInteractionParams
): Promise<ActionResponse<IInteractionDoc>> {
	const validationResult = await action({
		params,
		schema: CreateInteractionSchema,
		authorize: true,
	});

	if (validationResult instanceof Error) {
		console.error("Error in createInteraction:", validationResult);
		return handleError(validationResult) as ErrorResponse;
	}
	const { action: actionType, actionTarget, actionId, authorId } = validationResult.params!;

	const userId = validationResult.session?.user?.id;
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const [interaction] = await Interaction.create(
			[
				{
					user: userId,
					action: actionType,
					actionId,
					actionType: actionTarget,
				},
			],
			{ session }
		);
		if (!interaction) {
			throw new Error("Failed to create interaction");
		}
		await updateReputation({
			interaction,
			session,
			performerId: userId!,
			authorId,
		});
		await session.commitTransaction();
		return {
			success: true,
			data: JSON.parse(JSON.stringify(interaction)),
		};
	} catch (error) {
		session.abortTransaction();
		return handleError(error as Error) as ErrorResponse;
	} finally {
		session.endSession();
	}
}

export async function updateReputation(params: UpdateReputationParams) {
	const { interaction, session, performerId, authorId } = params;
	const { action, actionType } = interaction;
	let PerformerPoints = 0;
	let AuthorPoints = 0;
	switch (action) {
		case "upvote":
			PerformerPoints = 2;
			AuthorPoints = 10;
			if (performerId === authorId) {
				PerformerPoints = 0; // No points for self upvote
			}
			break;
		case "downvote":
			PerformerPoints = -1;
			AuthorPoints = -2;
			if (performerId === authorId) {
				AuthorPoints = 0; // No points for self downvote
			}
			break;
		case "post":
			AuthorPoints = actionType === "question" ? 5 : 10;
			break;
		case "delete":
			AuthorPoints = actionType === "question" ? -5 : -10;
			break;
	}
	if (performerId === authorId) {
		await User.findByIdAndUpdate(
			performerId,
			{
				$inc: { reputation: AuthorPoints },
			},
			{ session }
		);
		return;
	}
	await User.bulkWrite(
		[
			{
				updateOne: {
					filter: { _id: performerId },
					update: { $inc: { reputation: PerformerPoints } },
				},
			},
			{
				updateOne: {
					filter: { _id: authorId },
					update: { $inc: { reputation: AuthorPoints } },
				},
			},
		],
		{ session }
	);
}
