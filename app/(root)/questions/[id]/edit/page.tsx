import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";
import { UnauthorizedError } from "@/lib/http-errors";
import { notFound, redirect } from "next/navigation";
import React from "react";

const EditQuestion = async ({ params }: RouteParams) => {
	const { id } = await params;
	if (!id) notFound();
	const session = await auth();
	if (!session) return redirect(ROUTES.SIGN_IN);

	const { data: question, success } = await getQuestion({ questionId: id });
	if (!success) return notFound();

	if (question?.author._id.toString() !== session?.user?.id) {
		throw new UnauthorizedError("You are not authorized to edit this question.");
		redirect(ROUTES.QUESTIONS(id));
	}

	return (
		<main>
			<QuestionForm question={question} isEdit />
		</main>
	);
};

export default EditQuestion;
