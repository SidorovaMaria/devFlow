"use client";
import { cn } from "@/lib/utils";
import React from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { formURLQuery } from "@/lib/url";
interface Filter {
	name: string;
	value: string;
}
interface Props {
	filters: Filter[];
	otherClasses?: string;
	containerClasses?: string;
}

const CommonFilter = ({ filters, otherClasses = "", containerClasses = "" }: Props) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const paramsFilter = searchParams.get("filter") || "";
	const handleUpdateFilter = (filter: string) => {
		const newURL = formURLQuery({
			params: searchParams.toString(),
			key: "filter",
			value: filter,
		});
		router.push(newURL, { scroll: false });
	};
	return (
		<div className={cn("relative", containerClasses)}>
			<Select onValueChange={handleUpdateFilter} defaultValue={paramsFilter || undefined}>
				<SelectTrigger
					className={cn(
						"body-regular no-focus light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5",
						otherClasses
					)}
					aria-label="Filter options"
				>
					<div className="line-clamp-1 flex-1 text-left">
						<SelectValue placeholder="Select a filter" />
					</div>
				</SelectTrigger>
				<SelectContent>
					{filters.map((filter) => (
						<SelectItem
							key={filter.value}
							value={filter.value}
							className="py-2.5! border border-transparent hover:border-light-400/70"
						>
							{filter.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default CommonFilter;
