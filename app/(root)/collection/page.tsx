import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filter/CommonFilter";
import Pagination from "@/components/navigation/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { CollectionFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { EMPTY_COLLECTIONS } from "@/constants/states";
import { getSavedQuestions } from "@/lib/actions/collection.action";
import React from "react";
import { toast } from "sonner";

const Collections = async ({ searchParams }: RouteParams) => {
	const { page, pageSize, query, filter } = await searchParams;

	const { success, error, data } = await getSavedQuestions({
		page: Number(page) || 1,
		pageSize: Number(pageSize) || 5,
		query: query || "",
		filter: filter || "",
	});

	const { collection, isNext } = data || {};
	console.log(isNext, "isNext in collection page", collection?.length);
	return (
		<>
			<h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

			<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
				<LocalSearch
					route={ROUTES.COLLECTION}
					imgSrc="/icons/search.svg"
					placeholder="Search questions..."
					otherClasses="flex-1"
				/>
				<CommonFilter
					filters={CollectionFilters}
					otherClasses="min-h-[56px] w-full sm:min-w-[170px]"
				/>
			</div>
			<DataRenderer
				success={success}
				error={error}
				data={collection}
				empty={EMPTY_COLLECTIONS}
				render={(collections) => (
					<div>
						{collections.map((item) => (
							<QuestionCard key={item._id} {...item} />
						))}
					</div>
				)}
			/>
			<Pagination isNext={isNext || false} page={page} />
		</>
	);
};

export default Collections;
