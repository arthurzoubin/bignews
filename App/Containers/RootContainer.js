import React from 'react';
import { View, StatusBar } from 'react-native';
import ReduxNavigation from '../Navigation/ReduxNavigation';

import styles from './Styles/RootContainerStyles';

const RootContainer = () => (
  <View style={styles.applicationView}>
    <StatusBar barStyle="light-content" />
    <ReduxNavigation />
  </View>
);

export default RootContainer;
