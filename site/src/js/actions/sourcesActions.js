import axios from "axios";

export const SourcesActionTypes = {
  SOURCES_FETCH_STARTED: "SOURCES_FETCH_STARTED",
  SOURCES_FETCH_SUCCEEDED: "SOURCES_FETCH_SUCCEEDED",
  SOURCES_FETCH_FAILED: "SOURCES_FETCH_FAILED",
};

const SOURCES_URL = "http://localhost:5000/sources";

export const fetchSources = (args) => (dispatch) => {
  const { sourceTitle, sourceDomain } = args;
  dispatch({ type: SourcesActionTypes.SOURCES_FETCH_STARTED });
  return axios
    .post(SOURCES_URL, { title: sourceTitle, domain: sourceDomain })
    .then((resp) => {
      dispatch({
        type: SourcesActionTypes.SOURCES_FETCH_SUCCEEDED,
        payload: resp.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SourcesActionTypes.SOURCES_FETCH_FAILED,
        payload: err,
      });
      throw err;
    });
};
