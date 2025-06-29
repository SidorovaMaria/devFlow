import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";

const Home = async () => {
	return (
		<>
			<section className="w-full flex flex-col-reverse justify-between gap-4 sm:flex-row  sm:items-center">
				<h1 className="h1-bold text-dark100_light900"> All Questions</h1>
				<Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900!" asChild>
					<Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
				</Button>
			</section>
			<section className="mt-11">Local Seacrh</section>
			HomeFilter
			<div className="mt-11  flex w-full flex-col gap-6">
				<p>Questuion Card 1</p>
				<p>Questuion Card 1</p>
				<p>Questuion Card 1</p>
				<p>Questuion Card 1</p>
			</div>
		</>
	);
};
export default Home;
