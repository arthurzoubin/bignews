import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  newsListRequest: ['newsPayload'],
  newsListSuccess: ['newsResults'],
  newsListFailure: ['newsError'],
  sourceListRequest: null,
  sourceListSuccess: ['sourceResults'],
  sourceListFailure: ['sourceError'],
  clearStore: ['clearData'],
});

export const NewsListTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  newsListResults: null,
  newsListFetching: null,
  newsListError: null,
  sourceListResults: null,
  sourceListFetching: null,
  sourceListError: null,
  payload: null,
});

/* ------------- Selectors ------------- */

export const NewsListSelectors = {
  selectPayload: state => state.newsList.payload,
};

/* ------------- Reducers ------------- */

// get newsList
const newsListRequest = (state, action) => {
  const { newsPayload } = action;
  return state.merge({
    newsListFetching: true,
    newsListResults: null,
    payload: newsPayload,
  });
};

// successful newsList lookup
const newsListSuccess = (state, action) => {
  const { newsResults } = action;
  return state.merge({
    newsListFetching: false,
    newsListError: null,
    newsListResults: newsResults,
  });
};

// failed to get the newsList
const newsListFailure = state => state.merge({
  newsListFetching: false,
  newsListError: true,
  newsListResults: null,
});

// get sourceList
const sourceListRequest = state => state.merge({
  sourceListFetching: true,
  sourceListResults: null,
});

// successful sourceList lookup
const sourceListSuccess = (state, action) => {
  const { sourceResults } = action;
  return state.merge({
    sourceListFetching: false,
    sourceListError: null,
    sourceListResults: sourceResults,
  });
};

// failed to get the sourceList
const sourceListFailure = state => state.merge({
  sourceListFetching: false,
  sourceListError: true,
  sourceListResults: null,
});

// clear store if necessary
const clearStore = (state, action) => {
  const { clearData } = action;
  return state.merge({
    ...state,
    ...clearData,
  });
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.NEWS_LIST_REQUEST]: newsListRequest,
  [Types.NEWS_LIST_SUCCESS]: newsListSuccess,
  [Types.NEWS_LIST_FAILURE]: newsListFailure,
  [Types.SOURCE_LIST_REQUEST]: sourceListRequest,
  [Types.SOURCE_LIST_SUCCESS]: sourceListSuccess,
  [Types.SOURCE_LIST_FAILURE]: sourceListFailure,
  [Types.CLEAR_STORE]: clearStore,
});
