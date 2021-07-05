require("../css/main.scss");

const evaluate = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const title = formData.get("article-title");
  const references_section_name = formData.get("references-section-name");
  fetch("http://localhost:5000/evaluate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, references_section_name }),
  });
};

(function () {
  // Add handlers
  const form = document.getElementById("evaluator-form");
  form.addEventListener("submit", evaluate);
})();
