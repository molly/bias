import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { ACCURACY_COLORS, BIAS_COLORS } from "../../utils/colors";

export default function SourcesTable({ sources }) {
  const [showRowAccuracyHighlights, setShowRowAccuracyHighlights] =
    useState(true);
  const [showRowBiasHighlights, setShowRowBiasHighlights] = useState(false);

  const toggleCheckbox = ({ target }) => {
    if (target.id === "highlight-accuracy") {
      if (target.checked) {
        setShowRowBiasHighlights(false);
        setShowRowAccuracyHighlights(true);
      } else {
        setShowRowAccuracyHighlights(false);
      }
    } else if (target.id === "highlight-bias") {
      if (target.checked) {
        setShowRowAccuracyHighlights(false);
        setShowRowBiasHighlights(true);
      } else {
        setShowRowBiasHighlights(false);
      }
    }
  };

  const getRowColor = (evaluations) => {
    if ("mbfc" in evaluations) {
      if (showRowAccuracyHighlights) {
        const reliability = evaluations.mbfc.accuracy;
        if (reliability in ACCURACY_COLORS) {
          return ACCURACY_COLORS[reliability];
        }
      } else if (showRowBiasHighlights) {
        const bias = evaluations.mbfc.bias;
        if (bias in BIAS_COLORS) {
          return BIAS_COLORS[bias];
        }
      }
    }
    return null;
  };

  const renderEvaluation = (evaluation) => {
    if (!evaluation) {
      return null;
    }
    return (
      <>
        <b>{evaluation.display_name}</b>
        <br />
        Reliability: {evaluation.accuracy}
        <br />
        Bias: {evaluation.bias}
      </>
    );
  };

  const renderUsages = (usages, evaluations) => {
    let cite_usage;
    if (usages === 1) {
      cite_usage = "1 usage.";
    } else {
      cite_usage = `${usages} usages.`;
    }
    cite_usage += ` ${((usages / sources.total_usages) * 100).toPrecision(
      2
    )}% of total.`;

    let source_usage;
    if ("mbfc" in evaluations) {
      const domain = evaluations.mbfc.source_url;
      if (sources.domain_usages[domain]) {
        const domain_usage = sources.domain_usages[domain];
        if (domain_usage.citations == 1) {
          source_usage = `This is the only usage of ${evaluations.mbfc.display_name} in this article.`;
        } else {
          source_usage = `${evaluations.mbfc.display_name} is used in ${domain_usage.citations} citations in this article (${domain_usage.usages} usages).`;
        }
      }
    }
    return (
      <>
        {cite_usage}
        {source_usage && <br />}
        {source_usage}
      </>
    );
  };

  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < sources.total; i++) {
      const cite = sources.citations[i];
      const cite_link = cite.id ? `${sources.url}#${cite.id}` : sources.url;
      const color =
        showRowAccuracyHighlights || showRowBiasHighlights
          ? getRowColor(cite.evaluations)
          : null;
      rows.push(
        <tr
          key={cite.id ? `${i}-${cite.id}` : i}
          className={color ? `bg-${color}` : null}
        >
          <td>
            <a href={cite_link} target="_blank" rel="noreferrer">
              [{i + 1}]
            </a>
          </td>
          <td style={{ width: "50%", maxWidth: "500px" }}>{cite.text}</td>
          <td>{renderUsages(cite.usages, cite.evaluations)}</td>
          <td>
            {"mbfc" in cite.evaluations
              ? renderEvaluation(cite.evaluations.mbfc)
              : null}
          </td>
        </tr>
      );
    }
    return rows;
  };

  return (
    <>
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
      <table className="table table-bordered border-dark">
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
            <th>MB/FC evaluation</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </>
  );
}

SourcesTable.propTypes = {
  sources: PropTypes.shape({
    citations: PropTypes.object.isRequired,
    domain_usages: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    total_usages: PropTypes.number.isRequired,
  }).isRequired,
};
