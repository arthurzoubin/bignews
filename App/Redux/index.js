import { combineReducers } from 'redux';
import configureStore from './CreateStore';
import rootSaga from '../Sagas';

const navRedux = require('./NavigationRedux');
const newsListRedux = require('./NewsListRedux');
const sagas = require('../Sagas/index');

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
  nav: navRedux.reducer,
  newsList: newsListRedux.reducer,
});

export default () => {
  let { sagasManager } = configureStore(reducers, rootSaga);
  const { store, sagaMiddleware } = configureStore(reducers, rootSaga);

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = reducers;
      store.replaceReducer(nextRootReducer);

      const newYieldedSagas = sagas.default;
      sagasManager.cancel();
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware.run(newYieldedSagas);
      });
    });
  }

  return store;
};
