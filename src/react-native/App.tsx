import React from 'react';
import { Provider } from 'react-redux';
import store from './src/Redux/store';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import LeftDrawer from './src/Components/LeftDrawer';
import { createAppContainer } from 'react-navigation';
import Mec2 from './src/Components/Mec2/Mec2';

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
  </Provider>
}


