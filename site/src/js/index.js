require("../css/main.scss");

const evaluate = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const params = {};
  for (const [k, v] of formData.entries()) {
    if (v) {
      params[k] = v;
    }
  }
  const urlParams = new URLSearchParams(params);
  window.location.href = "/visualize.html?" + urlParams.toString();
};

(function () {
  // Add handlers
  const form = document.getElementById("evaluator-form");
  form.addEventListener("submit", evaluate);
})();
