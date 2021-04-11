import Slider from '@react-native-community/slider';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Mec2Update from './Mec2Update';
import { mec } from 'mec2-module';
import { g2 } from 'g2-module';
import { mecModelAction, mecModelSelect } from '../../Redux/MecModelSlice';
import Header from '../Header';

export default function Mec2({ navigation } = {} as any) {
  const modelSlice = useSelector(mecModelSelect);
  // We know that mec2 model is only written in JSON format.
  const model = JSON.parse(JSON.stringify(modelSlice.model));

  mec.model.extend(model);
  model.init();
  const g = g2().view({ x: 0, y: 100, cartesian: true });
  model.draw(g);

  const dispatch = useDispatch();
  return <View style={styles.container}>
    <Header navigation={navigation} />
    <Mec2Update model={model} g={g} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
