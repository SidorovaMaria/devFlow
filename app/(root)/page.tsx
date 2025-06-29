import { auth } from "@/auth";

const Home = async () => {
	const session = await auth();
	console.log("Session:", session);
	return (
		<div className="">
			<h1 className="h1-bold"> Welcome to the world on Next.js</h1>
		</div>
	);
};
export default Home;
