import { auth } from "@/auth";
import ProfileLink from "@/components/user/ProfileLink";
import UserAvatar from "@/components/UserAvatar";
import { getUser, getUserAnswers, getUserQuestions, getUserTags } from "@/lib/actions/user.action";
import { notFound, redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Stats from "@/components/user/Stats";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_ANSWERS, EMPTY_QUESTION, EMPTY_TAGS } from "@/constants/states";
import QuestionCard from "@/components/cards/QuestionCard";
import Pagination from "@/components/navigation/Pagination";
import AnswerCard from "@/components/cards/AnswerCard";
import TagCard from "@/components/cards/TagCard";
const Profile = async ({ params, searchParams }: RouteParams) => {
	const { id } = await params;
	const { page, pageSize } = await searchParams;
	const { success, data, error } = await getUser({
		userId: id,
	});
	const {
		success: userQuestionsSuccess,
		data: userQuestionsData,
		error: userQuestionsError,
	} = await getUserQuestions({
		userId: id,
		page: Number(page) || 1,
		pageSize: Number(pageSize) || 3,
	});
	const {
		success: userAnswersSuccess,
		data: userAnswersData,
		error: userAnswersError,
	} = await getUserAnswers({
		userId: id,
		page: Number(page) || 1,
		pageSize: Number(pageSize) || 3,
	});
	const {
		success: userTagsSuccess,
		data: userTagsData,
		error: userTagsError,
	} = await getUserTags({
		userId: id,
	});

	if (!id) notFound();
	const loggedInUser = await auth();

	if (!success || !userQuestionsSuccess || !userAnswersSuccess || !userTagsSuccess) {
		return <div className="h1-bold text-dark100_light900">{error?.message}</div>;
	}

	const { user, totalQuestions, totalAnswers } = data!;
	const { _id, name, image, portfolio, location, createdAt, username, bio } = user;
	const { questions: topQuestions, isNext: hasMoreQuestions } = userQuestionsData!;
	const { answers: userAnswers, isNext: hasMoreAnswers } = userAnswersData!;
	const { tags: userTags } = userTagsData!;

	return (
		<>
			<section className="flex flex-col-reverse items-start justify-between sm:flex-row">
				<div className="flex flex-col items-start gap-4 lg:flex-row">
					<UserAvatar
						id={_id}
						name={name}
						imageUrl={image}
						className="size-[140px] rounded-full object-cover"
						fallbackClassName="text-6xl fond-bolder"
					/>
					<div className="mt-3">
						<h2 className="h2-bold text-dark100_light900">{name}</h2>
						<p className="paragraph-regular text-dark200_light800">@{username}</p>
						<div className="mt-5 flex flex-wrap items-center justify-start gap-5">
							{portfolio && (
								<ProfileLink
									imgUrl="/icons/link.svg"
									href={portfolio}
									title="Portfolio"
								/>
							)}
							{location && (
								<ProfileLink imgUrl="/icons/location.svg" title="Portfolio" />
							)}
							<ProfileLink
								imgUrl="/icons/calendar.svg"
								title={dayjs(createdAt).format("MMMM YYYY")}
							/>
						</div>
						{bio && (
							<p className="paragraph-regular text-dark400_light800 mt-8">{bio}</p>
						)}
					</div>
				</div>
				<div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
					{loggedInUser?.user?.id === id && (
						<Link href="/profile/edit">
							<Button className="paragraph-medium cursor-pointer hover:brightness-125 btn-secondary text-dark300_light900 min-h-12 min-w-44 px-4 py-3 transition-colors duration-300 ease-in">
								Edit Profile
							</Button>
						</Link>
					)}
				</div>
			</section>
			<Stats
				totalQuestions={totalQuestions}
				totalAnswers={totalAnswers}
				badges={{
					GOLD: 0,
					SILVER: 0,
					BRONZE: 0,
				}}
			/>
			<section className="mt-10 flex gap-10">
				<Tabs defaultValue="top-posts" className="flex-[2]">
					<TabsList className="background-light800_dark400 min-h-[42px] p-1">
						<TabsTrigger value="top-posts" className="tab">
							Top Posts
						</TabsTrigger>
						<TabsTrigger value="answers" className="tab">
							Answers
						</TabsTrigger>
					</TabsList>
					<TabsContent value="top-posts" className="mt-5 flex w-full flex-col gap-10">
						<DataRenderer
							data={topQuestions}
							success={userQuestionsSuccess}
							error={userQuestionsError}
							empty={EMPTY_QUESTION}
							render={(topQuestions) => (
								<div className="flex w-full flex-col gap-6">
									{topQuestions.map((question) => (
										<QuestionCard
											key={question._id}
											question={question}
											showActionBtns={
												loggedInUser?.user?.id === question.author._id
											}
										/>
									))}
								</div>
							)}
						/>
						<Pagination page={page} isNext={hasMoreQuestions} />
					</TabsContent>
					<TabsContent value="answers" className="flex w-full flex-col gap-6">
						<DataRenderer
							data={userAnswers}
							success={userAnswersSuccess}
							error={userAnswersError}
							empty={EMPTY_ANSWERS}
							render={(topAnswers) => (
								<div className="flex w-full flex-col gap-6">
									{topAnswers.map((answer) => (
										<AnswerCard
											key={answer._id}
											{...answer}
											crop
											containerClasses="card-wrapper rounded-[10px] px-7 py-9 sm:px-11"
											showReadMore
											showActionBtns={
												loggedInUser?.user?.id === answer.author._id
											}
										/>
									))}
								</div>
							)}
						/>{" "}
						<Pagination page={page} isNext={hasMoreAnswers} />
					</TabsContent>
				</Tabs>
				<div className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
					<h3 className="h3-bold text-dark200_light900">Top Tech</h3>
					<div className="mt-7 flex flex-col gap-4">
						<DataRenderer
							data={userTags}
							empty={EMPTY_TAGS}
							success={userTagsSuccess}
							error={userTagsError}
							render={(tags) => (
								<div className="mt-3 flex w-full flex-col gap-4">
									{tags.map((tag) => (
										<TagCard
											key={tag._id}
											_id={tag._id}
											name={tag.name}
											questions={tag.count}
											showCount
											compact
										/>
									))}
								</div>
							)}
						/>
					</div>
				</div>
			</section>
		</>
	);
};

export default Profile;
