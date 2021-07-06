import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

export default function SourcesTable({ sources }) {
  const renderUsages = (usages) => {
    let text;
    if (usages === 1) {
      text = "1 usage.";
    } else {
      text = `${usages} usages.`;
    }
    text += ` ${((usages / sources.total_usages) * 100).toPrecision(
      2
    )}% of total.`;
    return text;
  };

  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < sources.total; i++) {
      const cite = sources.citations[i];
      const cite_link = cite.id ? `${sources.url}#${cite.id}` : sources.url;
      rows.push(
        <tr>
          <td>
            <a href={cite_link} target="_blank" rel="noreferrer">
              [{i}]
            </a>
          </td>
          <td
            className="text-truncate"
            style={{ width: "50%", maxWidth: "500px" }}
          >
            {cite.text}
          </td>
          <td>{renderUsages(cite.usages)}</td>
        </tr>
      );
    }
    return rows;
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Source</th>
          <th>
            Usages{" "}
            <Link to="/faq#usages" target="_blank">
              <FontAwesomeIcon icon={faQuestionCircle} />
              <span className="visually-hidden">?</span>
            </Link>
          </th>
        </tr>
      </thead>
      <tbody>{renderRows()}</tbody>
    </table>
  );
}

SourcesTable.propTypes = {
  sources: PropTypes.shape({
    citations: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    total_usages: PropTypes.number.isRequired,
  }).isRequired,
};
