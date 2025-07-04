import React, { Suspense } from "react";
import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import Metric from "@/components/Metric";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { redirect } from "next/navigation";
import { after } from "next/server";
import AnswerForm from "@/components/forms/AnswerForm";
import { getAnswers } from "@/lib/actions/answer.action";
import AllAnswers from "@/components/answers/AllAnswers";
import Votes from "@/components/votes/Votes";
import { hasVoted } from "@/lib/actions/vote.action";
import { RefreshCcw } from "lucide-react";
import SaveQuestion from "@/components/questions/SaveQuestion";
import { hasSavedQuestion, toggleSaveQuestion } from "@/lib/actions/collection.action";

const QuestionDetails = async ({ params, searchParams }: RouteParams) => {
	const { id } = await params;
	const { page, pageSize, filter } = await searchParams;
	const { success, data: question } = await getQuestion({ questionId: id });
	after(async () => {
		await incrementViews({ questionId: id });
	});

	if (!success || !question) {
		return redirect("/404");
	}
	const {
		success: areAnswersLoaded,
		data: AnswerResults,
		error: AnswersError,
	} = await getAnswers({
		questionId: id,
		page: Number(page) || 1,
		pageSize: Number(pageSize) || 1,
		filter,
	});

	const hasVotedPromise = hasVoted({ targetId: question._id, targetType: "question" });
	const hasSavedQuestionPromise = hasSavedQuestion({ questionId: question._id });

	const { author, createdAt, answers, views, title, tags, content } = question;
	return (
		<>
			<div className="flex-start w-full flex-col">
				<div className="flex w-full flex-col-reverse justify-between">
					<div className="flex items-center justify-start gap-3">
						<UserAvatar
							id={author._id}
							name={author.name}
							imageUrl={author.image}
							className="size-[36px]"
							fallbackClassName="text-[10px]"
						/>
						<Link href={ROUTES.PROFILE(author._id)}>
							<p className="paragraph-semibold text-dark300_light700">
								{author.name}
							</p>
						</Link>
					</div>

					<div className="flex justify-end gap-3">
						<Suspense
							fallback={
								<div className="text-xs flex items-center justify-center gap-2">
									<RefreshCcw className="animate-spin size-4" />
									Loading...
								</div>
							}
						>
							<Votes
								upvotes={question.upvotes}
								downvotes={question.downvotes}
								targetType="question"
								targetId={question._id}
								hasVotedPromise={hasVotedPromise}
							/>
						</Suspense>
						<Suspense>
							<SaveQuestion
								questionId={question._id}
								hasSavedQuestionPromise={hasSavedQuestionPromise}
							/>
						</Suspense>
					</div>
				</div>
				<h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">{title}</h2>
			</div>
			<div className="mb-8 mt-5 flex flex-wrap gap-4">
				<Metric
					imgUrl="/icons/clock.svg"
					alt="clock icon"
					value={` asked ${getTimeStamp(new Date(createdAt))}`}
					title=""
					textStyles="small-regular text-dark400_light700"
				/>
				<Metric
					imgUrl="/icons/message.svg"
					alt="message icon"
					value={answers}
					title=""
					textStyles="small-regular text-dark400_light700"
				/>
				<Metric
					imgUrl="/icons/eye.svg"
					alt="eye icon"
					value={formatNumber(views)}
					title=""
					textStyles="small-regular text-dark400_light700"
				/>
			</div>
			<Preview content={content} />
			<div className="mt-8 flex flex-wrap gap-2">
				{tags.map((tag: Tag) => (
					<TagCard key={tag._id} _id={tag._id as string} name={tag.name} compact />
				))}
			</div>
			<section className="my-5">
				<AllAnswers
					page={Number(page) || 1}
					isNext={AnswerResults?.isNext || false}
					data={AnswerResults?.answers || []}
					success={areAnswersLoaded}
					error={AnswersError}
					totalAnswers={AnswerResults?.totalAnswers || 0}
				/>
			</section>
			<section className="my-5">
				<AnswerForm
					questionId={question._id}
					questionTitle={question.title}
					questionContent={question.content}
				/>
			</section>
		</>
	);
};

export default QuestionDetails;
