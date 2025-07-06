import JobCard from "@/components/cards/JobCard";
import JobFilter from "@/components/filter/JobFilter";
import Pagination from "@/components/navigation/Pagination";
import { fetchCountries, fetchJobs, fetchLocation } from "@/lib/actions/job.action";
import React from "react";

const FindJobs = async ({ searchParams }: RouteParams) => {
	const { query, location, page } = await searchParams;
	const userLocation = await fetchLocation();
	const countries = await fetchCountries();
	const jobs = await fetchJobs({
		query: `${query}, ${location}` || `${query}` || "developer",
		page: page ?? 2,
	});

	const parsedPage = parseInt(page ?? 1);

	return (
		<>
			<h1 className="h1-bold text-dark100_light900">Jobs</h1>
			<section className="flex w-full mt-11 gap-3">
				<JobFilter countriesList={countries} />
			</section>

			<section className="light-border mb-9 mt-11 flex flex-col gap-9 border-b pb-9">
				{jobs.length > 0 ? (
					jobs
						.filter((job: Job) => job.job_title)
						.map((job: Job) => <JobCard key={job.job_id} job={job} />)
				) : (
					<div className="flex flex-col items-center justify-center gap-4">
						<h2 className="h2-semibold text-dark100_light900">No jobs found</h2>
						<p className="body-regular text-dark500_light700">
							Try changing your search criteria.
						</p>
					</div>
				)}
			</section>
			{jobs?.length > 0 && <Pagination page={parsedPage} isNext={true} />}
		</>
	);
};

export default FindJobs;
