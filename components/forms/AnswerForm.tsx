"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

import { AnswerSchema } from "@/lib/validations";

import { useRef, useState, useTransition } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { createAnswer } from "@/lib/actions/answer.action";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";

const Editor = dynamic(() => import("@/components/editor"), {
	ssr: false,
});
interface Props {
	questionId: string;
	questionTitle: string;
	questionContent: string;
}

const AnswerForm = ({ questionId, questionTitle, questionContent }: Props) => {
	const editorRef = useRef<MDXEditorMethods>(null);
	const [isAnswering, startAnsweringTransition] = useTransition();
	const [isAISubmitting, setIsAISubmitting] = useState(false);
	const session = useSession();

	const form = useForm<z.infer<typeof AnswerSchema>>({
		resolver: zodResolver(AnswerSchema),
		defaultValues: {
			content: "",
		},
	});

	const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
		startAnsweringTransition(async () => {
			const result = await createAnswer({
				questionId,
				content: values.content,
			});
			if (result.success) {
				form.reset();
				toast.success("Answer posted successfully!");
				if (editorRef.current) {
					editorRef.current.setMarkdown("");
				}
			} else {
				toast.error(`${result.error?.message} Failed to post answer. Please try again.`);
			}
		});
	};
	const generateAIAnswer = async () => {
		if (session.status !== "authenticated") {
			toast.error("You must be logged in to generate an AI answer.");
			return;
		}
		setIsAISubmitting(true);
		const userAnswer = editorRef.current?.getMarkdown();
		try {
			const { success, data, error } = await api.ai.getAnswer(
				questionTitle,
				questionContent,
				userAnswer
			);
			if (!success) {
				toast.error(`Failed to generate AI answer: ${error?.message || "Unknown error"}`);
			}
			const formattedAnswer = data.replace(/<br>/g, " ").toString().trim();
			console.log("Formatted AI Answer:", formattedAnswer);
			if (editorRef.current) {
				editorRef.current.setMarkdown(formattedAnswer);
				form.setValue("content", formattedAnswer);
				form.trigger("content");
			}
			toast.success("AI answer generated successfully!");
		} catch (error) {
			toast.error(`Failed to generate AI answer. Please try again.`, {
				description:
					error instanceof Error
						? error?.message
						: "A problem occurred while generating the answer.",
			});
		} finally {
			setIsAISubmitting(false);
		}
	};

	return (
		<div>
			<div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
				<h4 className="paragraph-semibold text-dark400_light800">Write your answer here</h4>
				<Button
					className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500
                    cursor-pointer hover:brightness-125"
					disabled={isAISubmitting}
					onClick={generateAIAnswer}
				>
					{isAISubmitting ? (
						<>
							<RefreshCcw className="mr-2 size-4 animate-spin" />
							Generating...
						</>
					) : (
						<>
							<Image
								src="/icons/stars.svg"
								alt="Generate AI Answer"
								width={12}
								height={12}
								className="object-contain"
							/>
							Generate AI Answer
						</>
					)}
				</Button>
			</div>
			<Form {...form}>
				<form
					className="mt-6 flex w-full flex-col gap-10"
					onSubmit={form.handleSubmit(handleSubmit)}
				>
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem className="flex w-full flex-col gap-3">
								<FormControl className="mt-3.5">
									<Editor
										editorRef={editorRef}
										value={field.value}
										fieldChange={field.onChange}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex justify-end">
						<Button
							type="submit"
							className="primary-gradient w-fit cursor-pointer hover:brightness-125"
						>
							{isAnswering ? (
								<>
									<RefreshCcw className="mr-2 size-4 animate-spin" />
									Posting...
								</>
							) : (
								"Post Answer"
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default AnswerForm;
