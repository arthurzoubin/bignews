import Actions, {
  reducer,
  INITIAL_STATE,
  NewsListSelectors,
} from '../../App/Redux/NewsListRedux';

describe('the actions for handling news list', () => {
  test('the payload should have values, the fetching status should be true, when requesting.', () => {
    const payload = true;
    const state = reducer(INITIAL_STATE, Actions.newsListRequest(payload));

    expect(state.newsListResults).toBeNull();
    expect(state.newsListFetching).toBe(true);
    expect(state.newsListError).toBeNull();
    expect(state.sourceListResults).toBeNull();
    expect(state.sourceListFetching).toBeNull();
    expect(state.sourceListError).toBeNull();
    expect(state.payload).toBe(true);
  });

  test('the results should have values, the fetching status should be false, the others should be null, when succeeded.', () => {
    const result = true;
    const state = reducer(INITIAL_STATE, Actions.newsListSuccess(result));

    expect(state.newsListResults).toBe(true);
    expect(state.newsListFetching).toBe(false);
    expect(state.newsListError).toBeNull();
    expect(state.sourceListResults).toBeNull();
    expect(state.sourceListFetching).toBeNull();
    expect(state.sourceListError).toBeNull();
    expect(state.payload).toBeNull();
  });

  test('the error should have values, the fetching status should be false, the others should be null, when failed.', () => {
    const state = reducer(INITIAL_STATE, Actions.newsListFailure());

    expect(state.newsListResults).toBeNull();
    expect(state.newsListFetching).toBe(false);
    expect(state.newsListError).toBe(true);
    expect(state.sourceListResults).toBeNull();
    expect(state.sourceListFetching).toBeNull();
    expect(state.sourceListError).toBeNull();
    expect(state.payload).toBeNull();
  });
});

describe('the actions for handling source list', () => {
  test('the fetching status should be true, the others should be null, when requesting.', () => {
    const state = reducer(INITIAL_STATE, Actions.sourceListRequest());

    expect(state.newsListResults).toBeNull();
    expect(state.newsListFetching).toBeNull();
    expect(state.newsListError).toBeNull();
    expect(state.sourceListResults).toBeNull();
    expect(state.sourceListFetching).toBe(true);
    expect(state.sourceListError).toBeNull();
    expect(state.payload).toBeNull();
  });

  test('the results should have values, the fetching status should be false, the others should be null, when succeeded.', () => {
    const result = true;
    const state = reducer(INITIAL_STATE, Actions.sourceListSuccess(result));

    expect(state.newsListResults).toBeNull();
    expect(state.newsListFetching).toBeNull();
    expect(state.newsListError).toBeNull();
    expect(state.sourceListResults).toBe(true);
    expect(state.sourceListFetching).toBe(false);
    expect(state.sourceListError).toBeNull();
    expect(state.payload).toBeNull();
  });

  test('the error should have values, the fetching status should be false, the others should be null, when failed.', () => {
    const state = reducer(INITIAL_STATE, Actions.sourceListFailure());

    expect(state.newsListResults).toBeNull();
    expect(state.newsListFetching).toBeNull();
    expect(state.newsListError).toBeNull();
    expect(state.sourceListResults).toBeNull();
    expect(state.sourceListFetching).toBe(false);
    expect(state.sourceListError).toBe(true);
    expect(state.payload).toBeNull();
  });
});

describe('select the payload from store', () => {
  test('should be true if the payload in state was true.', () => {
    const state = {
      newsList: {
        payload: true,
      },
    };
    expect(NewsListSelectors.selectPayload(state)).toBe(true);
  });
});

describe('reset data in store if necessary', () => {
  test('the payload in store should be true if the payload was set true', () => {
    const data = { payload: true };
    const state = reducer(INITIAL_STATE, Actions.clearStore(data));

    expect(state.newsListResults).toBeNull();
    expect(state.newsListFetching).toBeNull();
    expect(state.newsListError).toBeNull();
    expect(state.sourceListResults).toBeNull();
    expect(state.sourceListFetching).toBeNull();
    expect(state.sourceListError).toBeNull();
    expect(state.payload).toBe(true);
  });
});
