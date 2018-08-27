import { StackNavigator } from 'react-navigation';
import LaunchScreen from '../Containers/HomeScreen';

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  HomeScreen: { screen: LaunchScreen },
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'HomeScreen',
});

export default PrimaryNav;
