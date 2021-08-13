import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import { RequestStatusPropType } from "../utils/RequestStatus";
import { navigate } from "../utils/navigate";

import { fetchSources as fetchSourcesAction } from "../actions/sourcesActions";

function SingleSourceEvaluator({
  fetchSources,
  sourcesStatus,
  clicked,
  setClicked,
}) {
  const history = useHistory();
  const [formData, setFormData] = useState({
    field: "domain",
    value: "",
  });

  const evaluateAndGoToResults = useCallback(
    (e) => {
      e.preventDefault();
      setClicked("singleSource");
      const query = { [formData.field]: formData.value };
      if (!sourcesStatus.pending) {
        fetchSources(query)
          .then(() => navigate(query, "source", history))
          .catch(() => setClicked(null));
      }
    },
    [setClicked, formData, sourcesStatus, fetchSources, history]
  );

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Evaluate a single source</h5>
        <div className="mb-3">
          <form className="row g-2">
            <div className="col-sm-2">
              <select
                className="form-select"
                aria-label="Source attribute"
                value={formData.field}
                onChange={({ target: { value } }) =>
                  setFormData({ field: value, value: "" })
                }
              >
                <option value="domain">Domain</option>
                <option value="name">Name</option>
              </select>
            </div>

            <div className="col-sm-10">
              <input
                type="text"
                id="searchValue"
                name="searchValue"
                className="form-control"
                placeholder={
                  formData.field === "domain"
                    ? "nytimes.com"
                    : "The New York Times"
                }
                value={formData.value}
                onChange={({ target: { value } }) =>
                  setFormData({ ...formData, value })
                }
              />
            </div>
          </form>
        </div>
        <button
          className="btn btn-primary"
          onClick={evaluateAndGoToResults}
          disabled={clicked && clicked !== "singleSource"}
        >
          {sourcesStatus.pending && clicked === "singleSource" && (
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          Evaluate
        </button>
      </div>
    </div>
  );
}

SingleSourceEvaluator.propTypes = {
  fetchSources: PropTypes.func.isRequired,
  sourcesStatus: RequestStatusPropType.isRequired,
  clicked: PropTypes.oneOf(["list", "chart", "singleSource"]),
  setClicked: PropTypes.func.isRequired,
};

const select = (state) => ({
  sourcesStatus: state.sources.status,
});

const mapDispatchToProps = {
  fetchSources: fetchSourcesAction,
};

export default connect(select, mapDispatchToProps)(SingleSourceEvaluator);
