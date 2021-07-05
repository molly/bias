const evaluate = (queryParams) => {
  const { title, references_section_name } = Object.fromEntries(queryParams);
  fetch("http://localhost:5000/evaluate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, references_section_name }),
  });
};

export default evaluate;
