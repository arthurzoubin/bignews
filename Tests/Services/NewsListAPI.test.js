import R from 'ramda';
import NewsAPI from '../../App/Services/NewsApi';
import FixtureAPI from '../../App/Services/FixtureNewsApi';

const sourceListData = require('../../App/Fixtures/sourceList.json');
const newsListData = require('../../App/Fixtures/newsList.json');

describe('make a fixture API for the real API', () => {
  test('should be equal when all fixtures map to actual API', () => {
    const fixtureKeys = R.keys(FixtureAPI).sort();
    const apiKeys = R.keys(NewsAPI.create());

    const intersection = R.intersection(fixtureKeys, apiKeys).sort();

    // There is no difference between the intersection and all fixtures
    expect(R.equals(fixtureKeys, intersection)).toBe(true);
  });

  test('the news list APIs should be called successfully', () => {
    expect(NewsAPI.create().getNews().done()).toBeUndefined();
    expect(NewsAPI.create().getSources().done()).toBeUndefined();
  });
});

describe('use the APIs to get resource', () => {
  test('should return the right file, when getting source list by the FixtureAPI.', () => {
    const expectedFile = sourceListData;

    expect(FixtureAPI.getSources()).toEqual({
      ok: true,
      data: expectedFile,
    });
  });

  test('should return the right file, when getting news list by the FixtureAPI.', () => {
    const expectedFile = newsListData;

    expect(FixtureAPI.getNews()).toEqual({
      ok: true,
      data: expectedFile,
    });
  });
});
