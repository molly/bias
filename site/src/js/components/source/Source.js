import React, { useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { RequestStatusPropType } from "../../utils/RequestStatus";
import SourcePropType from "../../constants/SourcePropType";

import { fetchSources as fetchSourcesAction } from "../../actions/sourcesActions";

import SourceEvaluation from "./SourceEvaluation";
import Spinner from "../Spinner";
import APIError from "../APIError";

function Source({ fetchSources, sources, sourcesStatus }) {
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search.slice("1")),
    [location]
  );

  useEffect(() => {
    if (sourcesStatus.uninitialized) {
      fetchSources(Object.fromEntries(params));
    }
  }, [params, sourcesStatus, fetchSources]);

  const renderBody = () => {
    if (sourcesStatus.succeeded) {
      return <SourceEvaluation sources={sources} />;
    } else if (sourcesStatus.failed) {
      return <APIError status={sourcesStatus} />;
    } else {
      return <Spinner centered={true} height="200px" color="primary" />;
    }
  };

  return (
    <div className="container">
      <h1>{params.get("domain") || params.get("name")} source evaluation</h1>
      {renderBody()}
    </div>
  );
}

Source.propTypes = {
  fetchSources: PropTypes.func.isRequired,

  sourcesStatus: RequestStatusPropType.isRequired,
  sources: PropTypes.arrayOf(SourcePropType),
};

const select = (state) => ({
  sourcesStatus: state.sources.status,
  sources: state.sources.data,
});

const mapDispatchToProps = {
  fetchSources: fetchSourcesAction,
};

export default connect(select, mapDispatchToProps)(Source);
