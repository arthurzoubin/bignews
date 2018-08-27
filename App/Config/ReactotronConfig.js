import Immutable from 'seamless-immutable';
/* eslint-disable import/no-extraneous-dependencies */
import Reactotron from 'reactotron-react-native';
import { reactotronRedux as reduxPlugin } from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';
/* eslint-enable import/no-extraneous-dependencies */
import Config from './DebugConfig';

if (Config.useReactotron) {
  // https://github.com/infinitered/reactotron for more options!
  Reactotron
    .configure({ name: 'Daily News' })
    .useReactNative()
    .use(reduxPlugin({ onRestore: Immutable }))
    .use(sagaPlugin())
    .connect();

  // Let's clear Reactotron on every time we load the app
  Reactotron.clear();

  // Totally hacky, but this allows you to not both importing reactotron-react-native
  // on every file.  This is just DEV mode, so no big deal.
  /* eslint-disable no-console */
  console.tron = Reactotron;
  /* eslint-enable no-console */
}
