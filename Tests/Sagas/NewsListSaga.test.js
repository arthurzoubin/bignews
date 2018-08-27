import { put } from 'redux-saga/effects';
import { path } from 'ramda';
import FixtureAPI from '../../App/Services/FixtureNewsApi';
import { getNewsList, getSourcesList } from '../../App/Sagas/NewsListSagas';
import NewsListActions from '../../App/Redux/NewsListRedux';

const stepper = fn => mock => fn.next(mock).value;

describe('the actions for handling news list', () => {
  test('should call the newsListSuccess action, when succeed.', () => {
    const response = FixtureAPI.getNews(true);
    const step = stepper(getNewsList(FixtureAPI));
    // first step API
    step();
    // second step payload
    step();
    // third step successful return
    const stepResponse = step(response);
    // Get the result from the response
    const result = path(['data'], response);
    expect(stepResponse).toEqual(put(NewsListActions.newsListSuccess(result)));
  });

  test('should call the newsListFailure action, when failed.', () => {
    const response = { ok: false };
    const step = stepper(getNewsList(FixtureAPI));
    // first step API
    step();
    // second step payload
    step();
    // third step failed response
    expect(step(response)).toEqual(put(NewsListActions.newsListFailure()));
  });
});

describe('the actions for handling source list', () => {
  test('should call the sourceListSuccess action, when succeed.', () => {
    const response = FixtureAPI.getSources(true);
    const step = stepper(getSourcesList(FixtureAPI));
    // first step API
    step();
    // second  step successful return
    const stepResponse = step(response);
    // Get the result from the response
    const result = path(['data', 'sources'], response);
    expect(stepResponse).toEqual(put(NewsListActions.sourceListSuccess(result)));
  });

  test('should call the sourceListFailure action, when failed.', () => {
    const response = { ok: false };
    const step = stepper(getSourcesList(FixtureAPI));
    // first step API
    step();
    // second  step failed response
    expect(step(response)).toEqual(put(NewsListActions.sourceListFailure()));
  });
});
