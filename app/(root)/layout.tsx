import { ReactNode } from "react";

import Navbar from "@/components/navigation/navbar";
import SideBar from "@/components/navigation/navbar/SideBar";
import RightSideBar from "@/components/navigation/navbar/RightSideBar";

const RootLayout = ({ children }: { children: ReactNode }) => {
	return (
		<main className=" relative ">
			<Navbar />

			<div className="flex">
				<SideBar />
				<section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
					<div className="mx-auto w-full max-w-5xl">{children}</div>
				</section>
				<RightSideBar />
			</div>
		</main>
	);
};

export default RootLayout;
