import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function Header({ navigation } = {} as any) {
    return <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="arrow-forward" size={32} />
        </TouchableOpacity>
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
