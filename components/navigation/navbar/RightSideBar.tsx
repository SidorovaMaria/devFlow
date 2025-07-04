import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";

import ROUTES from "@/constants/routes";
import { EMPTY_HOT_QUESTIONS, EMPTY_POPULAR_TAGS } from "@/constants/states";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getPopularTags } from "@/lib/actions/tag.action";
import { cn } from "@/lib/utils";
import {
	ChevronRight,
	ChevronRightIcon,
	EggFriedIcon,
	LucideMessageCircleQuestionMark,
	MessageCircleQuestionMark,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const RightSideBar = async () => {
	const { success, data: hotQuestions, error } = await getHotQuestions();
	const { success: successTag, data: popularTags, error: errorTag } = await getPopularTags();

	return (
		<section className="pt-36 custom-scrollbar background-light900_dark200 sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow--y-auto border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden">
			<div>
				<h3 className="h3-bold text-dark200_light900"> Top Questions</h3>
				<div className="mt-7 flex w-full flex-col gap-[30px]">
					<DataRenderer
						data={hotQuestions}
						error={error}
						empty={EMPTY_HOT_QUESTIONS}
						success={success}
						render={(hotQuestions) => (
							<div className="mt-2 flex w-full flex-col gap-[30px]">
								{hotQuestions.map(({ _id, title }, index) => (
									<Link
										key={_id}
										href={ROUTES.QUESTIONS(_id)}
										className="flex cursor-pointer items-center justify-between gap-4"
									>
										<LucideMessageCircleQuestionMark
											className={cn(
												index % 2 === 0
													? "text-blue-400"
													: "text-primary-500",
												"min-w-4"
											)}
										/>

										<p className="body-medium text-dark500_light700 line-clamp-2 ">
											{title}
										</p>
										<ChevronRight className="text-dark500_light700" />
									</Link>
								))}
							</div>
						)}
					/>
				</div>
			</div>
			<div className="mt-16 ">
				<h3 className="h3-bold text-dark200_light900"> Popular Tags</h3>
				<div className="mt-7 flex flex-col gap-4">
					<DataRenderer
						data={popularTags}
						error={errorTag}
						success={successTag}
						empty={EMPTY_POPULAR_TAGS}
						render={(popularTags) => (
							<div>
								{popularTags.map(({ _id, name, questions }) => (
									<TagCard
										key={_id}
										_id={_id}
										name={name}
										questions={questions}
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
	);
};

export default RightSideBar;
