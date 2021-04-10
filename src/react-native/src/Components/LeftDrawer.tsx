import React from "react";
import { FlatList, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native-gesture-handler";

function Item({ item, navigate } = {} as any) {
    return <TouchableOpacity onPress={() => navigate(item.name)}>
        {/* <Ionicons name={item.icon} size={32} /> */}
        <Text>{item.name}</Text>
    </TouchableOpacity>
}

export default function LeftDrawer({ navigation } = {} as any) {
    const state = {
        routes: [
            {
                name: "Home",
                // icon: "ios-home"
            },
        ],
    }

    return <View>
        <FlatList
            style={{ width: "100%", marginLeft: 30 }}
            data={state.routes}
            renderItem={({ item }) => <Item item={item} navigate={navigation.navigate} />}
            keyExtractor={item => item.name}
        />
    </View>
}