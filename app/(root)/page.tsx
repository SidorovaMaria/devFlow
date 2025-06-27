import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

const Home = async () => {
	const session = await auth();
	console.log("Session:", session);
	return (
		<div className="">
			<h1 className="h1-bold"> Welcome to the world on Next.js</h1>
			<form
				className="px-10 pt-[100px]"
				action={async () => {
					"use server";
					await signOut({ redirectTo: ROUTES.SIGN_IN });
				}}
			>
				<Button type="submit" className="mt-4">
					Log Out
				</Button>
			</form>
		</div>
	);
};
export default Home;
