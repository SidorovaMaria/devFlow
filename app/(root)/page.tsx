import { auth, signOut } from "@/auth";
import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filter/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

import Link from "next/link";

const questions = [
	{
		_id: "1",
		title: "How to learn React?",
		description: "I want to learn React, can anyone help me?",
		tags: [
			{ _id: "1", name: "React" },
			{ _id: "2", name: "JavaScript" },
		],
		author: {
			_id: "1",
			name: "John Doe",
			image: "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
		},
		upvotes: 10,
		answers: 5,
		views: 100,
		createdAt: new Date("2025-04-01"),
	},
	{
		_id: "2",
		title: "What is the best way to learn JavaScript?",
		description: "I am new to JavaScript, what resources do you recommend?",
		tags: [
			{ _id: "3", name: "JavaScript" },
			{ _id: "4", name: "Web Development" },
		],
		author: {
			_id: "2",
			name: "Jane Smith",
			image: "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
		},
		upvotes: 20,
		answers: 10,
		views: 200,
		createdAt: new Date("2025-05-20"),
	},
	{
		_id: "3",
		title: "How to use Next.js?",
		description: "I want to build a website using Next.js, any tips?",
		tags: [
			{ _id: "5", name: "Next.js" },
			{ _id: "6", name: "React" },
		],
		author: {
			_id: "3",
			name: "Alice Johnson",
			image: "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
		},
		upvotes: 15,
		answers: 8,
		views: 150,
		createdAt: new Date("2025-06-12"),
	},
];

interface SearchParams {
	searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
	const session = await auth();
	console.log("Session:", session);
	const { query = "", filter = "" } = await searchParams;
	const filteredQuestions = questions.filter((question) => {
		const matchesQuery = question.title.toLowerCase().includes(query.toLowerCase());
		const matchesFilter = filter
			? question.tags[0].name.toLowerCase() === filter.toLowerCase()
			: true;
		return matchesQuery && matchesFilter;
	});
	//TODO properly
	return (
		<>
			<section className="w-full flex flex-col-reverse justify-between gap-4 sm:flex-row  sm:items-center">
				<h1 className="h1-bold text-dark100_light900"> All Questions</h1>
				<Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900!" asChild>
					<Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
				</Button>
			</section>
			<section className="mt-11">
				<LocalSearch
					route="/"
					imgSrc="/icons/search.svg"
					placeholder="Search questions..."
					otherClasses="flex-1"
				/>
			</section>

			<HomeFilter />
			<div className="mt-11  flex w-full flex-col gap-6">
				{filteredQuestions.map((question) => (
					<QuestionCard key={question._id} question={question} />
				))}
			</div>
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
		</>
	);
};
export default Home;
