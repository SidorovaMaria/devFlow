"use client";

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
				const baseRoute = item.route;
				const isProfile = baseRoute === "/profile";
				const finalRoute = isProfile && userId ? `${baseRoute}/${userId}` : baseRoute;

				const isActive =
					(pathname.includes(baseRoute) && baseRoute.length > 1) ||
					pathname === baseRoute;

				if (isProfile && !userId) return null;

				const LinkComponent = (
					<Link
						href={item.route}
						key={item.label}
						className={cn(
							isActive
								? "primary-gradient rounded-lg text-light-900"
								: "text-dark300_light900",
							"flex items-center justify-start gap-4 bg-transparent p-4"
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
					<SheetClose asChild key={finalRoute}>
						{LinkComponent}
					</SheetClose>
				) : (
					<React.Fragment key={finalRoute}>{LinkComponent}</React.Fragment>
				);
			})}
		</>
	);
};

export default NavLinks;
