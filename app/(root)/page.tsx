import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filter/CommonFilter";
import HomeFilter from "@/components/filter/HomeFilter";
import Pagination from "@/components/navigation/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getQuestions } from "@/lib/actions/question.action";

import Link from "next/link";

interface SearchParams {
	searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
	const { page, pageSize, query, filter } = await searchParams;
	const { success, data, error } = await getQuestions({
		page: Number(page) || 1,
		pageSize: Number(pageSize) || 5,
		query: query || "",
		filter: filter || "",
	});
	const { questions, isNext } = data || {};

	return (
		<>
			<section className="w-full flex flex-col-reverse justify-between gap-4 sm:flex-row  sm:items-center">
				<h1 className="h1-bold text-dark100_light900"> All Questions</h1>
				<Button
					className="primary-gradient min-h-[46px] px-4 py-3 text-light-900! cursor-pointer hover:brightness-125"
					asChild
				>
					<Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
				</Button>
			</section>
			<section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
				<LocalSearch
					route="/"
					imgSrc="/icons/search.svg"
					placeholder="Search questions..."
					otherClasses="flex-1"
				/>
				<CommonFilter
					filters={HomePageFilters}
					otherClasses="min-h-[56px] w-full sm:min-w-[170px]"
					// containerClasses="hidden max-md:flex"
				/>
			</section>

			<HomeFilter />
			<DataRenderer
				success={success}
				data={questions}
				error={error}
				empty={EMPTY_QUESTION}
				render={(questions) => (
					<div className="mt-11  flex w-full flex-col gap-6">
						{questions && questions.length > 0 ? (
							questions.map((question) => (
								<QuestionCard key={question._id} question={question} />
							))
						) : (
							<div className="mt-11 flex w-full items-center justify-center">
								<p className="text-dark400_light600 ">No questions found!</p>
							</div>
						)}
					</div>
				)}
			/>
			<Pagination isNext={isNext || false} page={page} />
		</>
	);
};
export default Home;
