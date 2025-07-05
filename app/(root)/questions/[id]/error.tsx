"use client"; // If using App Router

import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const funnyMessages = [
	"That question must’ve gone out for coffee ☕",
	"404: Question not found. Maybe it was too shy to show up.",
	"This question escaped the matrix. 🕶️",
	"Even Sherlock couldn’t find this one. 🔍",
	"Is it a question if it was never asked? 🤯",
];

const emojis = ["❓", "🙈", "📭", "👽", "🌀", "💭"];
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
				onClick={() => router.push(ROUTES.HOME)}
				className="primary-gradient min-h-[46px] px-4 py-3 text-light-900! cursor-pointer hover:brightness-125"
			>
				Go Back Home
			</Button>
			<p className="mt-10 text-sm text-gray-500">
				Error code: <span className="font-mono">404-U-NF</span>
			</p>
		</div>
	);
}
