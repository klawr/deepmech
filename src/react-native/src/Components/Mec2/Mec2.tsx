import Slider from '@react-native-community/slider';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Mec2SVG from './Mec2SVG';
import { mec } from 'mec2-module';
import { g2 } from 'g2-module';
import { mecModelAction, mecModelSelect } from '../../Redux/MecModelSlice';
import Header from '../Header';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import RightDrawer from './RightDrawer';
import { Ionicons } from '@expo/vector-icons';

function OpenRightDrawer({ navigation } = {} as any) {
  return <View style={styles.openDrawer}>
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
      <Ionicons name="arrow-back" size={32} />
    </TouchableOpacity>
  </View>
}

function SVGThingy({ navigation } = {} as any) {
  const modelSlice = useSelector(mecModelSelect);
  // We know that mec2 model is only written in JSON format.
  const model = JSON.parse(JSON.stringify(modelSlice.model));

  mec.model.extend(model);
  model.init();
  const g = g2().view({ x: 0, y: 100, cartesian: true });
  model.draw(g);

  const dispatch = useDispatch();
  return <View style={styles.container}>
    <OpenRightDrawer style={styles.openDrawer} navigation={navigation} />
    <Mec2SVG model={model} g={g} />
    <Slider
      onValueChange={(v) => dispatch(mecModelAction.updatePhi(v))}
      style={{ width: 200, height: 40 }}
      minimumValue={0}
      maximumValue={360}
      minimumTrackTintColor="#FFFFFF"
      maximumTrackTintColor="#000000"
    />
  </View>
}

const Drawer = createDrawerNavigator(
  {
    "Root": { screen: SVGThingy },
  },
  {
    initialRouteName: "Root",
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
  },
});
