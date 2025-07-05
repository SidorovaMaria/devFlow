import React, { Suspense } from "react";
import UserAvatar from "../UserAvatar";
import { cn, getTimeStamp } from "@/lib/utils";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import Preview from "../editor/Preview";
import Votes from "../votes/Votes";
import { hasVoted } from "@/lib/actions/vote.action";
import { RefreshCcw } from "lucide-react";
interface Props extends Answer {
	containerClasses?: string;
	showReadMore?: boolean;
	crop?: boolean;
	question?: string;
}
const AnswerCard = ({
	_id,
	author,
	upvotes,
	downvotes,
	content,
	createdAt,
	question,
	crop,
	containerClasses,
	showReadMore = false,
}: Props) => {
	const hasVotedPromise = hasVoted({
		targetId: _id,
		targetType: "answer",
	});
	if (crop) {
		content = content.length > 200 ? content.slice(0, 200) + "..." : content;
	}

	return (
		<article className={cn("light-border border-b py-10", containerClasses)}>
			<span id={`answer-${_id}`} className="hash-span" />
			<div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
				<div className="flex flex-1 items-start gap-1 sm:items-center">
					<UserAvatar
						id={author._id}
						name={author.name}
						imageUrl={author.image}
						className="size-5 rounded-full object-cover max-sm:mt-2"
					/>
					<Link
						href={ROUTES.PROFILE(author._id)}
						className="flex flex-col max-sm:ml-1 sm:flex-row sm:items-center"
					>
						<p className="body-semibold text-dark300_light700">
							{author.name ?? "Anonymous"}
						</p>

						<p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
							<span className="max-sm:hidden"> • </span>
							answered {getTimeStamp(createdAt)}
						</p>
					</Link>
				</div>
				<div className="flex justify-end">
					<Suspense
						fallback={
							<div className="text-xs flex items-center justify-center gap-2">
								<RefreshCcw className="animate-spin size-4" />
								Loading...
							</div>
						}
					>
						<Votes
							upvotes={upvotes}
							downvotes={downvotes}
							targetType="answer"
							targetId={_id}
							hasVotedPromise={hasVotedPromise}
						/>
					</Suspense>
				</div>
			</div>
			<Preview content={content} />

			{showReadMore && (
				<Link
					href={`/questions/${question}#answer-${_id}`}
					className="body-semibold relative z-10 font-space-grotesk text-primary-500"
				>
					<p className="mt-1">Read More...</p>
				</Link>
			)}
		</article>
	);
};

export default AnswerCard;
