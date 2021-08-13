import { ArticleSourcesActionTypes } from "../actions/articleSourcesActions";
import RequestStatus from "../utils/RequestStatus";

const defaultState = {
  status: RequestStatus.uninitialized(),
  data: null,
};

const articleSources = function (state = defaultState, action) {
  switch (action.type) {
    case ArticleSourcesActionTypes.ARTICLE_SOURCES_FETCH_STARTED:
      return { ...state, status: RequestStatus.pending() };
    case ArticleSourcesActionTypes.ARTICLE_SOURCES_FETCH_SUCCEEDED:
      return {
        status: RequestStatus.succeeded(),
        data: action.payload,
      };
    case ArticleSourcesActionTypes.ARTICLE_SOURCES_FETCH_FAILED:
      return { ...state, status: RequestStatus.failed(action.payload) };
    default:
      return state;
  }
};

export default articleSources;
