import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { RequestStatusPropType } from "../utils/RequestStatus";
import { navigate } from "../utils/navigate";

import { fetchSources as fetchSourcesAction } from "../actions/sourcesActions";

function SingleSourceEvaluator({
  fetchSources,
  sourcesStatus,
  clicked,
  setClicked,
}) {
  const [formData, setFormData] = useState({
    sourceTitle: "",
    sourceDomain: "",
  });

  const evaluateAndGoToResults = useCallback(
    (e) => {
      e.preventDefault();
      setClicked("singleSource");
      if (!sourcesStatus.pending) {
        fetchSources(formData)
          .then(() => navigate(formData, "source", history))
          .catch(() => setClicked(null));
      }
    },
    [setClicked, formData, sourcesStatus, fetchSources]
  );

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Evaluate a single source</h5>
        <label htmlFor="sourceTitle" className="form-label">
          Source name:
        </label>
        <input
          type="text"
          id="sourceTitle"
          name="sourceTitle"
          className="form-control"
          placeholder="The New York Times"
          value={formData.sourceTitle}
          onChange={({ target: { value } }) =>
            setFormData({ ...formData, sourceTitle: value })
          }
        />
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
