export const sampleQuestion = {
	id: "q123",
	title: "How to improve React app performance?",
	content: `### Question
  
  I'm looking for tips and best practices to enhance the performance of a React application. I have a moderately complex app with multiple components, and I've noticed some performance bottlenecks. What should I focus on?
  
  #### What I've Tried:
  - Lazy loading components
  - Using React.memo on some components
  - Managing state with React Context API
  
  #### Issues:
  - The app still lags when rendering large lists.
  - Switching between pages feels sluggish.
  - Sometimes, re-renders happen unexpectedly.
  
  #### Key Areas I Need Help With:
  1. Efficiently handling large datasets.
  2. Reducing unnecessary re-renders.
  3. Optimizing state management.
  
  Here is a snippet of my code that renders a large list. Maybe I'm doing something wrong here:
  
  \`\`\`js
  import React, { useState, useMemo } from "react";
  
  const LargeList = ({ items }) => {
    const [filter, setFilter] = useState("");
  
    // Filtering items dynamically
    const filteredItems = useMemo(() => {
      return items.filter((item) => item.includes(filter));
    }, [items, filter]);
  
    return (
      <div>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter items"
        />
        <ul>
          {filteredItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default LargeList;
  \`\`\`
  
  #### Questions:
  1. Is using \`useMemo\` the right approach here, or is there a better alternative?
  2. Should I implement virtualization for the list? If yes, which library would you recommend?
  3. Are there better ways to optimize state changes when dealing with user input and dynamic data?
  
  Looking forward to your suggestions and examples!
  
  **Tags:** React, Performance, State Management
    `,
	createdAt: "2025-01-15T12:34:56.789Z",
	upvotes: 42,
	downvotes: 3,
	views: 1234,
	answers: 5,
	tags: [
		{ _id: "tag1", name: "React" },
		{ _id: "tag2", name: "Node" },
		{ _id: "tag3", name: "PostgreSQL" },
	],
	author: {
		_id: "u456",
		name: "Jane Doe",
		image: "/avatars/jane-doe.png",
	},
};
