import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchSources as fetchSourcesAction } from "../actions/sourcesActions";
import { RequestStatusPropType } from "../utils/RequestStatus";
import APIError from "./APIError";

function Home({ fetchSources, sourcesStatus }) {
  const history = useHistory();
  const [formData, setFormData] = useState({
    title: "",
    references_section_name: "",
  });

  const navigate = () => {
    const queryString = Object.entries(formData)
      .filter(([_, v]) => !!v)
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
    history.push(`/list?${queryString}`);
  };

  const evaluate = (e) => {
    e.preventDefault();
    if (!sourcesStatus.pending) {
      fetchSources(formData)
        .then(navigate)
        .catch(() => {});
    }
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
        <APIError status={sourcesStatus} />
        <div className="col-md-12">
          <button className="btn btn-primary" onClick={evaluate}>
            {sourcesStatus.pending && (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            Evaluate
          </button>
        </div>
      </form>
    </div>
  );
}

Home.propTypes = {
  fetchSources: PropTypes.func.isRequired,
  sourcesStatus: RequestStatusPropType.isRequired,
};

const select = (state) => ({
  sourcesStatus: state.sources.status,
});

const mapDispatchToProps = {
  fetchSources: fetchSourcesAction,
};

export default connect(select, mapDispatchToProps)(Home);
