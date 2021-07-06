import React, { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { fetchSources as fetchSourcesAction } from "../actions/sourcesActions";

import Spinner from "./Spinner";
import RequestStatus from "../utils/RequestStatus";
import SourcesTable from "./SourcesTable";

function List({ fetchSources, sources, sourcesStatus }) {
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search.slice("1")),
    [location]
  );

  useEffect(() => {
    if (sourcesStatus.uninitialized) {
      fetchSources(params);
    }
  }, [params, sourcesStatus]);

  const renderBody = () => {
    if (sourcesStatus.succeeded) {
      return <SourcesTable sources={sources} />;
    } else if (sourcesStatus.failed) {
      return <div>Error</div>;
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

List.propTypes = {
  fetchSources: PropTypes.func.isRequired,

  sourcesStatus: PropTypes.instanceOf(RequestStatus).isRequired,
  sources: PropTypes.object,
};

const select = (state) => ({
  sourcesStatus: state.sources.status,
  sources: state.sources.data,
});

const mapDispatchToProps = {
  fetchSources: fetchSourcesAction,
};

export default connect(select, mapDispatchToProps)(List);
