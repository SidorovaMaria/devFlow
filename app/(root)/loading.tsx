import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const HomePageLoading = () => {
	return (
		<>
			<section className="w-full flex flex-col-reverse justify-between gap-4 sm:flex-row  sm:items-center">
				<Skeleton className="h-14 w-full sm:w-[200px]" />
				<Skeleton className="h-[46px] w-[180px]" />
			</section>
			<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
				<Skeleton className="h-14 flex-1" />
				<Skeleton className="h-14 w-28" />
			</div>
			<div className="mt-10 flex flex-wrap gap-3 sm:flex">
				{[1, 2, 3, 4].map((item) => (
					<Skeleton key={item} className="h-10 w-full rounded-xl xs:w-[150px]" />
				))}
			</div>
			<div className="mt-11 flex min-w-full  flex-col gap-6">
				{[1, 2, 3, 4, 5].map((item) => (
					<Skeleton key={item} className="h-60 w-full rounded-2xl " />
				))}
			</div>
		</>
	);
};

export default HomePageLoading;
