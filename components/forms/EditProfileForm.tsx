"use client";
import React, { startTransition } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { ProfileSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.action";
import { toast } from "sonner";

const EditProfileForm = ({ user }: { user: User }) => {
	const router = useRouter();
	const [isPending, setIsPending] = React.useState(false);
	const form = useForm<z.infer<typeof ProfileSchema>>({
		resolver: zodResolver(ProfileSchema),
		defaultValues: {
			name: user.name || "",
			username: user.username || "",
			bio: user.bio || "",
			location: user.location || "",
			portfolio: user.portfolio || "",
		},
	});
	const handleOnSubmit = async (data: z.infer<typeof ProfileSchema>) => {
		startTransition(async () => {
			setIsPending(true);
			const result = await updateUser({
				name: data.name,
				username: data.username,
				bio: data.bio || "",
				location: data.location || "",
				portfolio: data.portfolio || "",
			});

			if (result.success) {
				toast.success("Profile updated successfully!");
				router.push(`/profile/${user._id}`);
			} else {
				toast.error(result.error?.message || "Failed to update profile.");
			}
		});
	};
	return (
		<Form {...form}>
			<form
				className="flex w-full flex-col gap-10 mt-10"
				onSubmit={form.handleSubmit(handleOnSubmit)}
			>
				<div className="flex w-full gap-8">
					<FormField
						name="name"
						control={form.control}
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel className="paragraph-semibold text-dark400_light800">
									Full Name
								</FormLabel>
								<FormControl>
									<Input
										className="profile-input"
										placeholder="shadcn"
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					></FormField>
					<FormField
						name="username"
						control={form.control}
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel className="paragraph-semibold text-dark400_light800">
									Username
								</FormLabel>
								<FormControl>
									<Input
										className="profile-input"
										placeholder="shadcn"
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					></FormField>
				</div>
				<FormField
					name="bio"
					control={form.control}
					render={({ field }) => (
						<FormItem className="flex-1 ">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Bio
							</FormLabel>
							<FormControl className="">
								<Textarea
									aria-rowspan={5}
									className="profile-input p-2! min-h-36!"
									placeholder="Write a short bio about yourself "
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				></FormField>
				<div className="flex w-full gap-8">
					<FormField
						name="portfolio"
						control={form.control}
						render={({ field }) => (
							<FormItem className="flex-1 ">
								<FormLabel className="paragraph-semibold text-dark400_light800">
									Portfolio Link
								</FormLabel>
								<FormControl className="">
									<Input
										className="profile-input "
										placeholder="https://your-portfolio.com"
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					></FormField>
					<FormField
						name="location"
						control={form.control}
						render={({ field }) => (
							<FormItem className="flex-1 ">
								<FormLabel className="paragraph-semibold text-dark400_light800">
									Location
								</FormLabel>
								<FormControl className="">
									<Input
										className="profile-input "
										placeholder="City, Country"
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					></FormField>
				</div>
				<div className="mt-4 flex justify-end">
					<Button
						type="submit"
						// disabled={isPending}
						className="primary-gradient paragraph-semibold! w-fit text-light-900"
					>
						{/* {isPending ? (
							<>
								<RefreshCcw className="mr-2 size-4 animate-spin" />
								<span className="hidden md:inline">Submitting...</span>
							</>
						) : (
							<>{isEdit ? "Edit" : "Ask A"} Question</>
						)} */}
						Submit
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default EditProfileForm;
