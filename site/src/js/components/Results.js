import React, { useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { RequestStatusPropType } from "../utils/RequestStatus";

import { fetchSources as fetchSourcesAction } from "../actions/sourcesActions";

import Spinner from "./Spinner";
import APIError from "./APIError";
import SourcesPropType from "../constants/SourcesPropType";

function Results({ fetchSources, sources, sourcesStatus, children }) {
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
      return React.cloneElement(children, { sources });
    } else if (sourcesStatus.failed) {
      return <APIError status={sourcesStatus} />;
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

Results.propTypes = {
  fetchSources: PropTypes.func.isRequired,

  children: PropTypes.element.isRequired,
  sourcesStatus: RequestStatusPropType.isRequired,
  sources: SourcesPropType,
};

const select = (state) => ({
  sourcesStatus: state.sources.status,
  sources: state.sources.data,
});

const mapDispatchToProps = {
  fetchSources: fetchSourcesAction,
};

export default connect(select, mapDispatchToProps)(Results);
