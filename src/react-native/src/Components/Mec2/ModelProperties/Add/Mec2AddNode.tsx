import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Mec2AddNode() {
    return <View>
        <TouchableOpacity onPress={() => console.log("Here could be your advert! TODO")}>
            <View style={style.row}>
                <Ionicons name="add" size={32} />
                <Text>Add node</Text>
            </View>
        </TouchableOpacity>
    </View>
}

const style = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        alignContent: "space-between",
    }
})