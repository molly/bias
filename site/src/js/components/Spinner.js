import React from "react";

export default function Spinner({ centered, height, color }) {
  const spinnerElement = (
    <div
      className={`spinner-border${color ? ` text-${color}` : null}`}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  if (centered) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: height }}
      >
        {spinnerElement}
      </div>
    );
  }
  return spinnerElement;
}
