import React from "react";
import PropTypes from "prop-types";

import SourcePropType from "../../constants/SourcePropType";
import Raters from "../../constants/Raters";

import capitalize from "../../utils/capitalize";

export default function SourceEvaluation({ sources }) {
  debugger;
  if (sources.length === 0) {
    return <i>No results</i>;
  }

  const renderRow = (source) => {
    const rater = Raters[source.rater];
    return (
      <tr key={source._id}>
        <td>
          <a href={rater.url}>{rater.title}</a> (
          <a href={rater.about_url}>about</a>)
        </td>
        <td>
          <a href={source.rater_url}>link</a>
        </td>
        <td>{capitalize(source.accuracy_str)}</td>
        <td>{capitalize(source.bias_str)}</td>
      </tr>
    );
  };

  return (
    <div className="container">
      <table className="table table-bordered border-dark">
        <thead>
          <tr>
            <th>Rater</th>
            <th>Rating</th>
            <th>Accuracy</th>
            <th>Bias</th>
          </tr>
        </thead>
        <tbody>{sources.map(renderRow)}</tbody>
      </table>
    </div>
  );
}

SourceEvaluation.propTypes = {
  sources: PropTypes.arrayOf(SourcePropType).isRequired,
};
