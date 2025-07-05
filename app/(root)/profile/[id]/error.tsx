"use client"; // if using app directory
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const funnyMessages = [
	"This user vanished like cookies in the office kitchen.",
	"404? More like 4-oh-no-you-didn’t-find-that-user!",
	"We looked under the rug. Still no user.",
	"This user is more mysterious than your browser history.",
	"They were here a minute ago… probably.",
];

const emojis = ["🕵️‍♂️", "🦄", "👻", "🪄", "🫠", "🥸"];

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const router = useRouter();
	const [message, setMessage] = useState("");
	const [emoji, setEmoji] = useState("");

	useEffect(() => {
		setMessage(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
		setEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
	}, []);

	return (
		<div className="min-h-screen flex flex-col justify-center items-center px-4 text-center">
			<h1 className="text-6xl font-extrabold mb-4">
				{emoji} {error.message}
			</h1>
			<p className="text-xl mb-6 max-w-xl">{message}</p>

			<Button
				onClick={() => router.push(ROUTES.COMMUNITY)}
				className="primary-gradient min-h-[46px] px-4 py-3 text-light-900! cursor-pointer hover:brightness-125"
			>
				Go See Others
			</Button>
			<p className="mt-10 text-sm text-gray-500">
				Error code: <span className="font-mono">404-U-NF</span>
			</p>
		</div>
	);
}
