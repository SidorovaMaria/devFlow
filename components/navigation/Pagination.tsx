"use client";
import { cn } from "@/lib/utils";

import React from "react";
import { Button } from "../ui/button";
import { formURLQuery } from "@/lib/url";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
interface Props {
	page: number | undefined | string;
	isNext: boolean;
	containerClasses?: string;
}
const Pagination = ({ page = 1, isNext, containerClasses }: Props) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleNavigation = (direction: "next" | "prev") => {
		const nextPageNumber = direction === "next" ? Number(page) + 1 : Number(page) - 1;
		const newUrl = formURLQuery({
			params: searchParams.toString(),
			key: "page",
			value: nextPageNumber.toString(),
		});
		router.push(newUrl);
	};
	return (
		<div className={cn("flex mt-4 w-full justify-center items-center gap-2", containerClasses)}>
			{Number(page) > 1 && (
				<Button
					onClick={() => handleNavigation("prev")}
					className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border
                    hover:brightness-200 cursor-pointer transition-all duration-200 ease-in-out"
				>
					<ChevronLeft className="text-dark200_light800 body-medium " />
				</Button>
			)}
			<div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
				<p className="body-semibold text-light-900">{page}</p>
			</div>
			{/* Next Page Button */}
			{isNext && (
				<Button
					onClick={() => handleNavigation("next")}
					className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border
                    hover:brightness-200 cursor-pointer transition-all duration-200 ease-in-out"
				>
					<ChevronRight className="text-dark200_light800 body-medium " />
				</Button>
			)}
		</div>
	);
};

export default Pagination;
