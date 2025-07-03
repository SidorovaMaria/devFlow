"use client";
import { createVote } from "@/lib/actions/vote.action";
import { formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { use, useState } from "react";
import { toast } from "sonner";
interface Params {
	upvotes: number;
	targetType: "question" | "answer";
	downvotes: number;
	targetId: string;
	hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
}
const Votes = ({ upvotes, downvotes, targetId, targetType, hasVotedPromise }: Params) => {
	const session = useSession();
	const userId = session.data?.user?.id;
	const [isLoading, setisLoading] = useState(false);
	const { success, data } = use(hasVotedPromise);
	const { hasUpVoted, hasDownVoted } = data || {};

	const handleVote = async (type: "upvote" | "downvote") => {
		if (!userId) return toast.error("You need to be logged in to vote.");
		setisLoading(true);
		try {
			const result = await createVote({
				targetId,
				targetType,
				voteType: type,
			});
			if (!result.success) {
				return toast.error(result.error?.message || "An error occurred while voting.");
			}

			const successMessage =
				type === "upvote"
					? `Upvote ${!hasUpVoted ? "added" : "removed"} successfully`
					: `Downvote ${!hasDownVoted ? "added" : "removed"} successfully`;
			toast.success(successMessage);
		} catch (error) {
			return toast.error("An error occurred while voting.");
		} finally {
			setisLoading(false);
		}
	};

	return (
		<div className="flex-center gap-2.5">
			<div className="flex-center gap-1.5">
				<Image
					src={success && hasUpVoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
					width={18}
					height={18}
					alt="upvote"
					className={`cursor-pointer ${isLoading && "opacity-50"}`}
					aria-label="Upvote"
					onClick={() => !isLoading && handleVote("upvote")}
				/>

				<div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
					<p className="subtle-medium text-dark400_light900">
						{formatNumber(Number(upvotes))}
					</p>
				</div>
			</div>

			<div className="flex-center gap-1.5">
				<Image
					src={success && hasDownVoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
					width={18}
					height={18}
					alt="downvote"
					className={`cursor-pointer ${isLoading && "opacity-50"}`}
					aria-label="Downvote"
					onClick={() => !isLoading && handleVote("downvote")}
				/>

				<div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
					<p className="subtle-medium text-dark400_light900">
						{formatNumber(Number(downvotes))}
					</p>
				</div>
			</div>
		</div>
	);
};

export default Votes;
