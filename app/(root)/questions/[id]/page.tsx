import React from "react";

const QuestionDetails = async ({ params }: RouteParams) => {
	const { id } = await params;
	console.log("Question ID:", id);
	return <div>Question Page: {id}</div>;
};

export default QuestionDetails;
