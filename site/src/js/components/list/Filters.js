import React from "react";
import PropTypes from "prop-types";

export default function Filters({
  toggleCheckbox,
  showRowAccuracyHighlights,
  showRowBiasHighlights,
}) {
  return (
    <div className="row row-cols-sm-auto align-items-center my-2">
      <div className="col-auto">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="highlight-accuracy"
            onChange={toggleCheckbox}
            checked={showRowAccuracyHighlights}
          />
          <label className="form-check-label" htmlFor="highlight-accuracy">
            Color-code by accuracy
          </label>
        </div>
      </div>
      <div className="col-auto">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="highlight-bias"
            onChange={toggleCheckbox}
            checked={showRowBiasHighlights}
          />
          <label className="form-check-label" htmlFor="highlight-bias">
            Color-code by bias
          </label>
        </div>
      </div>
    </div>
  );
}

Filters.propTypes = {
  toggleCheckbox: PropTypes.func.isRequired,
  showRowAccuracyHighlights: PropTypes.bool.isRequired,
  showRowBiasHighlights: PropTypes.bool.isRequired,
};
