import React, { Component } from 'react';
import { BackHandler, Platform } from 'react-native';
import { addNavigationHelpers } from 'react-navigation';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppNavigation from './AppNavigation';

class ReduxNavigation extends Component {
  componentWillMount() {
    if (Platform.OS === 'ios') return;
    BackHandler.addEventListener('hardwareBackPress', () => {
      const { dispatch, nav } = this.props;
      // change to whatever is your first screen, otherwise unpredictable results may occur
      if (nav.routes.length === 1 && (nav.routes[0].routeName === 'LaunchScreen')) {
        return false;
      }
      // if (shouldCloseApp(nav)) return false
      dispatch({ type: 'Navigation/BACK' });
      return true;
    });
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios') return;
    BackHandler.removeEventListener('hardwareBackPress');
  }

  render() {
    const { dispatch, nav } = this.props;
    return (
      <AppNavigation navigation={
      addNavigationHelpers({
        dispatch,
        state: nav,
        addListener: createReduxBoundAddListener('root'),
      })}
      />
    );
  }
}
ReduxNavigation.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.shape.isRequired,
};
const mapStateToProps = state => ({ nav: state.nav });
export default connect(mapStateToProps)(ReduxNavigation);
