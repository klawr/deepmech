import * as React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Mec2SVG from './Utils/Mec2SVG';
import { IConstraintExtended, mec } from 'mec2-module';
import { g2 } from 'g2-module';
import { mecModelSelectModel } from '../../Redux/MecModelSlice';
import Header from '../Header';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import RightDrawer from './Utils/RightDrawer';
import { Ionicons } from '@expo/vector-icons';

function OpenRightDrawer({ navigation } = {} as any) {
  return <View style={styles.openDrawer}>
    <TouchableOpacity onPress={navigation.openDrawer}>
      <Ionicons name="arrow-back" size={32} />
    </TouchableOpacity>
  </View>
}

function SVGThingy({ navigation } = {} as any) {
  const modelSlice = useSelector(mecModelSelectModel);
  // We know that mec2 model is only written in JSON format.
  const model = JSON.parse(JSON.stringify(modelSlice));

  mec.model.extend(model);
  model.init();
  // TODO y should be bound to android screen height
  const y = Platform.OS === 'android' ? -400 : 100;
  const g = g2().view({ x: 0, y, cartesian: true });
  model.draw(g);
  const drive = model.constraints.find((c: IConstraintExtended) => c.ori.type === 'drive' || c.len.type === 'drive');

  return <View style={styles.container}>
    <Mec2SVG {...{ model, g, drive }} />
    <OpenRightDrawer style={styles.openDrawer} navigation={navigation} />
  </View>
}

const Drawer = createDrawerNavigator(
  {
    "Root": { screen: SVGThingy },
  },
  {
    initialRouteName: "Root",
    // TODO make this variable?
    drawerWidth: () => 400,
    unmountInactiveRoutes: true,
    drawerPosition: 'right',
    defaultNavigationOptions: {
      drawerLockMode: 'locked-closed',
    },
    contentComponent: props => <RightDrawer {...props} />
  })
const AppNavigator = createStackNavigator(
  { Drawer: { screen: Drawer }, },
  { initialRouteName: "Drawer", headerMode: "none", },
);
const AppContainer = createAppContainer(AppNavigator);

export default function Mec2({ navigation } = {} as any) {
  return <View style={{ flex: 1 }}>
    <AppContainer />
    <Header navigation={navigation} />
  </View >
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  openDrawer: {
    top: 0,
    right: 0,
    position: "absolute",
    height: 60,
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 20
  }
});
