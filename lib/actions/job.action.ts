import { JobFilterParams } from "@/types/action";
import handleError from "../handlers/error";

export const fetchLocation = async () => {
	try {
		const response = await fetch("http://ip-api.com/json/?fields=country");
		if (!response.ok) {
			throw new Error("Failed to fetch location");
		}
		const location = await response.json();

		return location.country;
	} catch (error) {
		console.error("Error fetching location:", error);
		return null;
	}
};

export const fetchCountries = async () => {
	try {
		const response = await fetch("https://restcountries.com/v3.1/all?fields=name");

		if (!response.ok) {
			throw new Error("Failed to fetch countries");
		}
		const result = await response.json();
		return result;
	} catch (error) {
		console.log(error);
	}
};

export const fetchJobs = async (filters: JobFilterParams) => {
	try {
		const { query, page } = filters;

		const headers = {
			"X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY ?? "",
			"X-RapidAPI-Host": "jsearch.p.rapidapi.com",
		};

		const response = await fetch(
			`https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}`,
			{
				headers,
			}
		);
		if (!response.ok) {
			throw new Error("Failed to fetch jobs");
		}

		const result = await response.json();

		return result.data;
	} catch (error) {
		return handleError(error);
	}
};
