function evaluate(e) {
  e.preventDefault();
  var formData = new FormData(e.target);
  var title = formData.get("article-title");
  fetch("http://localhost:5000/evaluate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });
}

(function () {
  // Add handlers
  var form = document.getElementById("evaluator-form");
  form.addEventListener("submit", evaluate);
})();
