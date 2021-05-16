import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import * as tf from '@tensorflow/tfjs';
import * as tfrn from '@tensorflow/tfjs-react-native';
// import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

export default function Header({ navigation } = {} as any) {
    const [ready, SetReady] = React.useState("no");
    const [modelLoaded, SetModelLoaded] = React.useState("not");

    tf.ready().then(() => {
        const modelJson = require('../../assets/model.json');
        const modelWeights = require('../../assets/group1-shard1of1.bin');
        tf.loadLayersModel(tfrn.bundleResourceIO(modelJson, modelWeights)).then(() => SetModelLoaded("it worked"));
        SetReady("yes");
    });

    return <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="arrow-forward" size={32} />
        </TouchableOpacity>
        <Text>{ready} {modelLoaded}</Text>
    </View>
}

const styles = StyleSheet.create({
    header: {
        position: "absolute",
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20
    },
});
