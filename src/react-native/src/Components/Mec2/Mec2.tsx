import Slider from '@react-native-community/slider';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Mec2Update from './Mec2Update';
import { mec } from 'mec2-module';
import { g2 } from 'g2-module';
import { mecModelAction } from '../../Redux/MecModelSlice';

export default function App() {
  const model: mec = {
    "gravity": true,
    "nodes": [
      { "id": "A0", "x": 75, "y": 50, "base": true },
      { "id": "A", "x": 70, "y": 100 },
      { "id": "B", "x": 275, "y": 170 },
      { "id": "B0", "x": 275, "y": 50, "base": true },
      { "id": "C", "x": 125, "y": 175 }
    ],
    "constraints": [
      {
        "id": "a", "p1": "A0", "p2": "A", "len": { "type": "const" },
        "ori": { "type": "drive", "Dt": 2, "Dw": 6.28, "input": 1 }
      }, {
        "id": "b", "p1": "A", "p2": "B", "len": { "type": "const" }
      }, {
        "id": "c", "p1": "B0", "p2": "B", "len": { "type": "const" }
      }, {
        "id": "d", "p1": "B", "p2": "C", "len": { "type": "const" },
        "ori": { "ref": "b", "type": "const" }
      }
    ]
  };
  mec.model.extend(model);
  model.init();
  const g = g2().view({ x: 0, y: 100, cartesian: true });
  model.draw(g);

  const dispatch = useDispatch();
  return <View>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
