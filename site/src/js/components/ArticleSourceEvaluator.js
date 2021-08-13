import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Collapse } from "bootstrap";

import { fetchArticleSources as fetchArticleSourcesAction } from "../actions/articleSourcesActions";
import { RequestStatusPropType } from "../utils/RequestStatus";
import { navigate } from "../utils/navigate";

import APIError from "./APIError";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

function ArticleSourceEvaluator({
  fetchArticleSources,
  articleSourcesStatus,
  clicked,
  setClicked,
}) {
  const history = useHistory();
  const [formData, setFormData] = useState({
    title: "",
    references_section_name: "",
  });
  const [isAdditionalOptionsOpen, setIsAdditionalOptionsOpen] = useState(false);

  const evaluate = useCallback(
    (e, targetPage) => {
      e.preventDefault();
      setClicked(targetPage);
      if (!articleSourcesStatus.pending) {
        fetchArticleSources(formData)
          .then(() => navigate(formData, targetPage, history))
          .catch(() => setClicked(null));
      }
    },
    [fetchArticleSources, articleSourcesStatus, formData, setClicked, history]
  );

  const evaluateAndGoToList = useCallback(
    (e) => evaluate(e, "list"),
    [evaluate]
  );
  const evaluateAndGoToChart = useCallback(
    (e) => evaluate(e, "chart"),
    [evaluate]
  );

  useEffect(() => {
    const additionalOptions = document.getElementById(
      "collapse-additional-options"
    );
    const bsCollapse = new Collapse(additionalOptions, { toggle: false });
    isAdditionalOptionsOpen ? bsCollapse.show() : bsCollapse.hide();
  });

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Wikipedia article source evaluator</h5>
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

      <div className="card-body">
        <button
          type="button"
          className="btn btn-link btn-sm text-dark"
          data-toggle="collapse"
          data-target="#collapse-additional-options"
          aria-expanded={`${isAdditionalOptionsOpen}`}
          aria-controls="collapse-additional-options"
          role="button"
          onClick={() => setIsAdditionalOptionsOpen(!isAdditionalOptionsOpen)}
        >
          <FontAwesomeIcon icon={faCaretDown} />
          <b className="ms-1">Additional options</b>
        </button>
        <div className="collapse" id="collapse-additional-options">
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
      </div>
      <div className="card-body">
        <APIError status={articleSourcesStatus} />
        <button
          className="btn btn-primary me-2"
          onClick={evaluateAndGoToList}
          disabled={clicked && clicked !== "list"}
        >
          {clicked === "list" && (
            <span
              className="spinner-border spinner-border-sm me-2 "
              role="status"
              aria-hidden="true"
            ></span>
          )}
          List results
        </button>
        <button
          className="btn btn-primary"
          onClick={evaluateAndGoToChart}
          disabled={clicked && clicked !== "chart"}
        >
          {clicked === "chart" && (
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          Chart results
        </button>
      </div>
    </div>
  );
}

ArticleSourceEvaluator.propTypes = {
  fetchArticleSources: PropTypes.func.isRequired,
  articleSourcesStatus: RequestStatusPropType.isRequired,
  clicked: PropTypes.oneOf(["list", "chart", "singleSource"]),
  setClicked: PropTypes.func.isRequired,
};

const select = (state) => ({
  articleSourcesStatus: state.articleSources.status,
});

const mapDispatchToProps = {
  fetchArticleSources: fetchArticleSourcesAction,
};

export default connect(select, mapDispatchToProps)(ArticleSourceEvaluator);
