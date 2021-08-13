import axios from "axios";

export const ArticleSourcesActionTypes = {
  ARTICLE_SOURCES_FETCH_STARTED: "ARTICLE_SOURCES_FETCH_STARTED",
  ARTICLE_SOURCES_FETCH_SUCCEEDED: "ARTICLE_SOURCES_FETCH_SUCCEEDED",
  ARTICLE_SOURCES_FETCH_FAILED: "ARTICLE_SOURCES_FETCH_FAILED",
};

const SOURCES_URL = "http://localhost:5000/evaluate";

export const fetchArticleSources = (args) => (dispatch) => {
  const { title, references_section_name } = args;
  dispatch({ type: ArticleSourcesActionTypes.ARTICLE_SOURCES_FETCH_STARTED });
  return axios
    .post(SOURCES_URL, { title, references_section_name })
    .then((resp) => {
      dispatch({
        type: ArticleSourcesActionTypes.ARTICLE_SOURCES_FETCH_SUCCEEDED,
        payload: resp.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: ArticleSourcesActionTypes.ARTICLE_SOURCES_FETCH_FAILED,
        payload: err,
      });
      throw err;
    });
};
