import { takeLatest, all } from 'redux-saga/effects';
import NEWSAPI from '../Services/NewsApi';
import FixtureNewsAPI from '../Services/FixtureNewsApi';
import DebugConfig from '../Config/DebugConfig';

/* ------------- Types ------------- */

import { NewsListTypes } from '../Redux/NewsListRedux';

/* ------------- Sagas ------------- */

import { getNewsList, getSourcesList } from './NewsListSagas';

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const newsApi = DebugConfig.useFixtures ? FixtureNewsAPI : NEWSAPI.create();
/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    takeLatest(NewsListTypes.NEWS_LIST_REQUEST, getNewsList, newsApi),
    takeLatest(NewsListTypes.SOURCE_LIST_REQUEST, getSourcesList, newsApi),
  ]);
}
