import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import RNDeepmech from 'react-native-deepmech';

export default function Header({ navigation } = {} as any) {
    const [a, setA] = React.useState("hello");
    RNDeepmech.sample('hello', setA);

    return <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="arrow-forward" size={32} />
        </TouchableOpacity>
        <Text>{a}</Text>
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
