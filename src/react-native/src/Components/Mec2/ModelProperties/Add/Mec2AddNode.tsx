import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Mec2AddNode() {
    return <View>
        <TouchableOpacity onPress={() => console.log("Here could be your advert! TODO")}>
            <Ionicons name="add" size={32} />
        </TouchableOpacity>
    </View>

}