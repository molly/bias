import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { RequestStatusPropType } from "../utils/RequestStatus";

import ArticleSourceEvaluator from "./ArticleSourceEvaluator";
import SingleSourceEvaluator from "./SingleSourceEvaluator";

function Home({ articleSourcesStatus, sourcesStatus }) {
  const [clicked, setClicked] = useState(null);
  useEffect(() => {
    if ([articleSourcesStatus, sourcesStatus].some((status) => status.failed)) {
      setClicked(null);
    }
  }, [articleSourcesStatus, sourcesStatus]);

  return (
    <div className="container">
      <div className="row">
        <ArticleSourceEvaluator clicked={clicked} setClicked={setClicked} />
        <SingleSourceEvaluator clicked={clicked} setClicked={setClicked} />
      </div>
    </div>
  );
}

Home.propTypes = {
  articleSourcesStatus: RequestStatusPropType.isRequired,
  sourcesStatus: RequestStatusPropType.isRequired,
};

const select = (state) => ({
  articleSourcesStatus: state.articleSources.status,
  sourcesStatus: state.sources.status,
});

export default connect(select)(Home);
