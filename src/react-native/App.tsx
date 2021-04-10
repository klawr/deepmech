import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/Redux/store';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import LeftDrawer from './src/Components/LeftDrawer';
import { createAppContainer } from 'react-navigation';
import Mec2 from './src/Components/Mec2/Mec2';
import { Ionicons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator(
  {
    Mec2: { screen: Mec2 },
  },
  {
    drawerLockMode: 'locked-closed',
    initialRouteName: "Mec2",
    unmountInactiveRoutes: true,
    contentComponent: props => <LeftDrawer {...props} />
  }
)

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

export default function Main({ navigation } = {} as any) {
  return <Provider store={store}>
    <AppContainer />
  </Provider>
}


