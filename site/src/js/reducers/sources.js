import { SourcesActionTypes } from "../actions/sourcesActions";
import RequestStatus from "../utils/RequestStatus";

const defaultState = {
  status: RequestStatus.uninitialized(),
  data: null,
};

const sources = function (state = defaultState, action) {
  switch (action.type) {
    case SourcesActionTypes.SOURCES_FETCH_STARTED:
      return { ...state, status: RequestStatus.pending() };
    case SourcesActionTypes.SOURCES_FETCH_SUCCEEDED:
      return {
        status: RequestStatus.succeeded(),
        data: action.payload,
      };
    case SourcesActionTypes.SOURCES_FETCH_FAILED:
      return { ...state, status: RequestStatus.failed(action.payload) };
    default:
      return state;
  }
};

export default sources;
