import { Button, View } from "react-native";
import { useDispatch } from "react-redux";
import { UIAction } from "./Redux/UISlice";
import Mec2 from './Components/Mec2/Mec2';
import React from 'react';

export default function App() {
    const dispatch = useDispatch();
    return <View>
        <Button title=">"
            onPress={() => dispatch(UIAction.left(true))} />
        <Mec2 />
    </View>
}
