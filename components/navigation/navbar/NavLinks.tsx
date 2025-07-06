"use client";

import { auth } from "@/auth";
import { SheetClose } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavLinks = ({ isMobileNav = false, userId }: { isMobileNav?: boolean; userId?: string }) => {
	const pathname = usePathname();
	return (
		<>
			{sidebarLinks.map((item) => {
				if (item.route === "/profile") {
					if (userId) item.route = `${item.route}/${userId}`;
					else return null;
				}

				const isActive =
					(pathname.includes(item.route) && item.route.length > 1) ||
					pathname === item.route;

				const LinkComponent = (
					<Link
						href={item.route}
						key={item.label}
						className={cn(
							isActive
								? "primary-gradient  text-light-900"
								: "text-dark300_light900 hover:bg-dark-300/25  dark:hover:bg-dark-300! hover:brightness-125",
							"flex items-center justify-start gap-4 bg-transparent p-4 rounded-lg"
						)}
					>
						<Image
							src={item.imgURL}
							alt={item.label}
							width={20}
							height={20}
							className={cn({ "invert-colors w-5 h-5": !isActive })}
						/>
						<p
							className={cn(
								isActive ? "base-bold" : "base-medium",
								!isMobileNav && "max-lg:hidden"
							)}
						>
							{item.label}
						</p>
					</Link>
				);

				return isMobileNav ? (
					<SheetClose asChild key={item.route}>
						{LinkComponent}
					</SheetClose>
				) : (
					<React.Fragment key={item.route}>{LinkComponent}</React.Fragment>
				);
			})}
		</>
	);
};

export default NavLinks;
