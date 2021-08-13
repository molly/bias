import React, { useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { RequestStatusPropType } from "../utils/RequestStatus";

import { fetchArticleSources as fetchArticleSourcesAction } from "../actions/articleSourcesActions";

import Spinner from "./Spinner";
import APIError from "./APIError";
import ArticleSourcesPropType from "../constants/ArticleSourcesPropType";

function ArticleResults({
  fetchArticleSources,
  sources,
  articleSourcesStatus,
  children,
}) {
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search.slice("1")),
    [location]
  );

  useEffect(() => {
    if (articleSourcesStatus.uninitialized) {
      fetchArticleSources(Object.fromEntries(params));
    }
  }, [params, articleSourcesStatus, fetchArticleSources]);

  const renderBody = () => {
    if (articleSourcesStatus.succeeded) {
      return React.cloneElement(children, { sources });
    } else if (articleSourcesStatus.failed) {
      return <APIError status={articleSourcesStatus} />;
    } else {
      return <Spinner centered={true} height="200px" color="primary" />;
    }
  };

  return (
    <div className="container">
      <h1>{params.get("title")} source evaluation</h1>
      {renderBody()}
    </div>
  );
}

ArticleResults.propTypes = {
  fetchArticleSources: PropTypes.func.isRequired,

  children: PropTypes.element.isRequired,
  articleSourcesStatus: RequestStatusPropType.isRequired,
  sources: ArticleSourcesPropType,
};

const select = (state) => ({
  articleSourcesStatus: state.articleSources.status,
  sources: state.articleSources.data,
});

const mapDispatchToProps = {
  fetchArticleSources: fetchArticleSourcesAction,
};

export default connect(select, mapDispatchToProps)(ArticleResults);
