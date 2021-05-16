import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

export default function Header({ navigation } = {} as any) {
    const [ready, SetReady] = React.useState("no");

    tf.ready().then(() => SetReady("yes"));

    return <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="arrow-forward" size={32} />
        </TouchableOpacity>
        <Text>{ready}</Text>
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
