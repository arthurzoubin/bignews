import { call, put, select } from 'redux-saga/effects';
import { path } from 'ramda';
import NewsListActions, { NewsListSelectors } from '../Redux/NewsListRedux';

export function* getNewsList(api) {
  // make the call to the api
  const { selectPayload } = NewsListSelectors;
  const { newsListSuccess, newsListFailure } = NewsListActions;
  const payload = yield select(selectPayload);
  const response = yield call(api.getNews, payload);

  if (response.ok) {
    const result = path(['data'], response);
    // do data conversion here if needed
    yield put(newsListSuccess(result));
  } else {
    yield put(newsListFailure());
  }
}

export function* getSourcesList(api) {
  // make the call to the api
  const response = yield call(api.getSources);
  const { sourceListSuccess, sourceListFailure } = NewsListActions;
  if (response.ok) {
    const result = path(['data', 'sources'], response);
    // do data conversion here if needed
    yield put(sourceListSuccess(result));
  } else {
    yield put(sourceListFailure());
  }
}
