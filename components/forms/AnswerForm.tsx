"use client";
import { z, ZodObject, ZodRawShape } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AnswerSchema, FIELD_NAMES, FIELD_TYPES } from "@/lib/validations";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";

const Editor = dynamic(() => import("@/components/editor"), {
	ssr: false,
});

const AnswerForm = () => {
	const editorRef = useRef<MDXEditorMethods>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isAISubmitting, setIsAISubmitting] = useState(false);

	const form = useForm<z.infer<typeof AnswerSchema>>({
		resolver: zodResolver(AnswerSchema),
		defaultValues: {
			content: "",
		},
	});

	const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
		console.log("Form submitted with values:", values);
	};

	return (
		<div>
			<div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
				<h4 className="paragraph-semibold text-dark400_light800">Write your answer here</h4>
				<Button
					className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500
                    cursor-pointer hover:brightness-125"
					disabled={isAISubmitting}
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
							{isSubmitting ? (
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
