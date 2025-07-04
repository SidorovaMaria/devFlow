"use client";
import { toggleSaveQuestion } from "@/lib/actions/collection.action";
import { UnauthorizedError } from "@/lib/http-errors";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { use, useState } from "react";
import { toast } from "sonner";

const SaveQuestion = ({
	questionId,
	hasSavedQuestionPromise,
}: {
	questionId: string;
	hasSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>>;
}) => {
	const session = useSession();
	const userId = session?.data?.user?.id;
	const [isLoading, setIsLoading] = useState(false);
	const { data } = use(hasSavedQuestionPromise);
	const { saved: hasSaved } = data || {};

	const handleSave = async () => {
		if (isLoading) return;
		if (!userId) return toast.error("You need to be logged in to save a question.");
		setIsLoading(true);
		try {
			const { success, data, error } = await toggleSaveQuestion({ questionId });
			if (!success)
				return toast.error(
					error?.message || "An error occurred while saving the question."
				);
			toast.success(`Question ${data?.saved ? "saved" : "unsaved"} successfully`);
		} catch (error) {
			if (error instanceof UnauthorizedError) {
				return toast.error("You need to be logged in to save a question.");
			}
			return toast.error("An error occurred while saving the question.");
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Image
			src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
			width={18}
			height={18}
			alt="save"
			className={`cursor-pointer ${isLoading && "opacity-50"}`}
			aria-label="Save question"
			onClick={handleSave}
		/>
	);
};

export default SaveQuestion;
