import { processJobTitle } from "@/lib/utils";
import { Link } from "lucide-react";
import Image from "next/image";
import React from "react";

const JobCard = ({ job }: { job: Job }) => {
	const {
		employer_name,
		employer_logo,
		employer_website,
		job_employment_type,
		job_title,
		job_description,
		job_apply_link,
		job_city,
		job_state,
		job_country,
	} = job;

	return (
		<section className="background-light900_dark200 light-border shadow-light100_darknone flex flex-col items-start gap-6 rounded-lg border p-6 sm:flex-row sm:p-8">
			<div className="flex w-full justify-end sm:hidden">
				<JobLocation job_country={job_country} job_city={job_city} job_state={job_state} />
			</div>
			<div className="flex items-center gap-6">
				{employer_logo ? (
					<Link
						href={employer_website ?? "/jobs"}
						className="background-light800_dark400 relative size-16 rounded-xl"
					>
						<Image
							src={"/icons/au.svg"}
							alt="company logo"
							fill
							className="size-full object-contain p-2"
						/>
					</Link>
				) : (
					<Image
						src="/images/site-logo.svg"
						alt="default site logo"
						width={64}
						height={64}
						className="rounded-[10px]"
					/>
				)}
			</div>
			<div className="w-full">
				<div className="flex-between flex-wrap gap-2">
					<p className="base-semibold text-dark200_light900">
						{processJobTitle(job_title)}
					</p>

					<div className="hidden sm:flex">
						<JobLocation
							job_country={job_country}
							job_city={job_city}
							job_state={job_state}
						/>
					</div>
				</div>

				<p className="body-regular text-dark500_light700  mt-2 line-clamp-2">
					{job_description?.slice(0, 200)}
				</p>
			</div>
		</section>
	);
};

export default JobCard;
interface JobLocationProps {
	job_country?: string;
	job_city?: string;
	job_state?: string;
}
const JobLocation = ({ job_country, job_city, job_state }: JobLocationProps) => {
	return (
		<div className="background-light800_dark400 flex items-center justify-end gap-2 rounded-2xl px-3 py-1.5">
			<Image
				src={`https://flagsapi.com/${job_country}/flat/64.png`}
				alt="country symbol"
				width={16}
				height={16}
				className="rounded-full"
			/>

			<p className="body-medium text-dark400_light700">
				{job_city && `${job_city}, `}
				{job_state && `${job_state}, `}
				{job_country && `${job_country}`}
			</p>
		</div>
	);
};
