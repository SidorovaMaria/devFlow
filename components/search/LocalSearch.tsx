"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formURLQuery, removeKeyFromURLQuery } from "@/lib/url";
interface Props {
	route: string;
	imgSrc: string;
	placeholder: string;
	otherClasses?: string;
}
const LocalSearch = ({ route, imgSrc, placeholder, otherClasses }: Props) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const query = searchParams.get("query") || "";
	const [searchQuery, setSearchQuery] = useState(query);

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (searchQuery) {
				const newUrl = formURLQuery({
					params: searchParams.toString(),
					key: "query",
					value: searchQuery,
				});
				router.push(newUrl, { scroll: false });
			} else {
				if (pathname === route) {
					console.log("Removing query from URL");
					const newUrl = removeKeyFromURLQuery({
						params: searchParams.toString(),
						keysToRemove: ["query"],
					});
					router.push(newUrl, { scroll: false });
				}
			}
		}, 300);

		return () => clearTimeout(delayDebounceFn);
	}, [searchQuery, searchParams, router, route, pathname]);
	return (
		<div
			className={`background-light800_darkgradient flex min-h-[56px] grow items-center rounded-[10px] px-4 ${otherClasses}`}
		>
			<Image
				src={imgSrc}
				alt="Search Icon"
				width={24}
				height={24}
				className="cursor-pointer"
			/>
			<Input
				type="text"
				placeholder={placeholder}
				value={searchQuery}
				onChange={(e) => {
					setSearchQuery(e.target.value);
				}}
				className="paragraph-regular no-focus placeholder:text-dark400_light700 border-none shadow-none outline-none"
			/>
		</div>
	);
};

export default LocalSearch;
