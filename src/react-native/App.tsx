import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux';
import LeftDrawer from './src/Components/LeftDrawer';
import Mec2 from './src/Components/Mec2/Mec2';
import store from './src/Redux/store';

const Drawer = createDrawerNavigator(
  {
    Mec2: { screen: Mec2 },
  },
  {
    initialRouteName: "Mec2",
    unmountInactiveRoutes: true,
    defaultNavigationOptions: {
      drawerLockMode: 'locked-closed',
    },
    contentComponent: props => <LeftDrawer {...props} />
  }
);

const AppNavigator = createStackNavigator(
  {
    Drawer: { screen: Drawer },
  },
  {
    initialRouteName: "Drawer",
    headerMode: "none",
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default function Main() {
  return <Provider store={store}>
    <AppContainer />
  </Provider >
}


