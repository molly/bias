import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function Home() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    title: "",
    references_section_name: "",
  });

  const navigate = (e) => {
    e.preventDefault();
    const queryString = Object.entries(formData)
      .filter(([_, v]) => !!v)
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
    history.push(`/list?${queryString}`);
  };

  return (
    <div className="container form-block">
      <h1>Wikipedia article source evaluator</h1>
      <form id="evaluator-form" className="row">
        <div className="col-md-6 mb-4">
          <label htmlFor="title" className="form-label">
            Article title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            placeholder="Trojan Room coffee pot"
            value={formData.title}
            onChange={({ target: { value } }) =>
              setFormData({ ...formData, title: value })
            }
            required
          />
        </div>
        <hr />
        <h5>Additional options</h5>
        <div className="col-md-4">
          <label htmlFor="references-section-name" className="form-label">
            References section name:
          </label>
          <input
            type="text"
            id="references-section-name"
            name="references_section_name"
            className="form-control form-control-sm"
            aria-describedby="references-section-name-help"
            value={formData.references_section_name}
            onChange={({ target: { value } }) =>
              setFormData({ ...formData, references_section_name: value })
            }
          />
          <p id="references-section-name-help" className="form-text">
            Defaults to &quot;References&quot;, but if the section is titled
            something different like &quot;Notes&quot;, enter it here.
          </p>
        </div>
        <div className="col-md-12">
          <button className="btn btn-primary" onClick={navigate}>
            Evaluate
          </button>
        </div>
      </form>
    </div>
  );
}
