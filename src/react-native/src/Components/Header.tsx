import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function Header({ openDrawer } = {} as any) {
    return <View style={styles.header}>
        <TouchableOpacity onPress={() => openDrawer()}>
            <Ionicons name="arrow-forward" size={32} />
        </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
    header: {
        top: 0,
        width: "100%",
        position: "absolute",
        height: 60,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20
    },
});
