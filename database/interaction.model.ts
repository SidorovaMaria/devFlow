import { Types, model, models, Schema, Document } from "mongoose";

interface IInteraction {
	user: Types.ObjectId;
	action: string;
	actionId: Types.ObjectId;
	actionType: "question" | "answer";
}
export const InteractionActionEnums = [
	"view",
	"upvote", //user who does teh action + 2 // user recieveing +10
	"downvote", //user who does the action -1 // user receiving -2
	"bookmark",
	"post", //user who asks the question + 5 // user who owns the question +5
	"edit",
	"delete", //user deletes the question or answer -5 // user who owns the question of the anwer -5
	"search",
] as const;
export interface IInteractionDoc extends IInteraction, Document {}
const InteractionSchema = new Schema<IInteraction>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		action: {
			type: String,
			enum: InteractionActionEnums,
			required: true,
		},
		actionId: { type: Schema.Types.ObjectId, required: true },
		actionType: { type: String, enum: ["question", "answer"], required: true },
	},
	{ timestamps: true }
);
const Interaction = models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);
export default Interaction;
