import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux';
import LeftDrawer from './src/Components/LeftDrawer';
import store from './src/Redux/store';

const AppNavigator = createStackNavigator(
  { Drawer: { screen: LeftDrawer }, },
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


