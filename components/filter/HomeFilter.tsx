"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formURLQuery, removeKeyFromURLQuery } from "@/lib/url";

const filters = [
	// { name: "React", value: "react" },
	// { name: "JavaScript", value: "javascript" },
	{
		name: "Newest",
		value: "newest",
	},
	{
		name: "Popular",
		value: "popular",
	},
	{ name: "Answered", value: "answered" },
	{
		name: "Unanswered",
		value: "unanswered",
	},
	{
		name: "Recommended",
		value: "recommended",
	},
];

const HomeFilter = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const filterParam = searchParams.get("filter") || "";
	const [active, setActive] = useState<string>(filterParam || "");
	const handleClick = (filter: string) => {
		let newUrlParams = "";
		if (filter === active) {
			setActive("");
			newUrlParams = removeKeyFromURLQuery({
				params: searchParams.toString(),
				keysToRemove: ["filter"],
			});
		} else {
			setActive(filter);
			newUrlParams = formURLQuery({
				params: searchParams.toString(),
				key: "filter",
				value: filter,
			});
		}
		router.push(newUrlParams, { scroll: false });
	};
	return (
		<div className="mt-10 flex flex-wrap gap-3 sm:flex">
			{filters.map((filter) => (
				<Button
					className={cn(
						`body-medium cursor-pointer rounded-lg px-6 py-3 capitalize shadow-none`,
						active === filter.value
							? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
							: "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
					)}
					key={filter.name}
					onClick={() => handleClick(filter.value)}
				>
					{filter.name}
				</Button>
			))}
		</div>
	);
};

export default HomeFilter;
