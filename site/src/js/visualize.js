const get_source_data = () => {
  const { title, references_section_name } = Object.fromEntries(
    new URLSearchParams(window.location.search.slice(1))
  );
  fetch("http://localhost:5000/evaluate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, references_section_name }),
  });
};

(function () {
  // Fetch source data
  get_source_data();
})();
