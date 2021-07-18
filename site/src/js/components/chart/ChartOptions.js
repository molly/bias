import React from "react";
import PropTypes from "prop-types";

export default function ChartOptions({ options, setOptions, className }) {
  const makeEventHandler =
    (field) =>
    ({ target }) => {
      const value = target.type === "checkbox" ? target.checked : target.value;
      setOptions({ ...options, [field]: value });
    };

  return (
    <div className={className}>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Chart options</h5>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="sizeBasedOnUsage"
              checked={options.sizeBasedOnUsage}
              onChange={makeEventHandler("sizeBasedOnUsage")}
            />
            <label className="form-check-label" htmlFor="sizeBasedOnUsage">
              Show points sized proportionally to usage in article
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

ChartOptions.propTypes = {
  options: PropTypes.object.isRequired,
  setOptions: PropTypes.func.isRequired,
  className: PropTypes.string,
};
