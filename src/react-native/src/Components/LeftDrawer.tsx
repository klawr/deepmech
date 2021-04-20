import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

function Header({ navigation } = {} as any) {
    return <View style={styles.header}>
        <Pressable onPress={() => navigation.closeDrawer()}>
            <Ionicons name="arrow-back" size={32} />
        </Pressable>
    </View>
}

function Item({ item, navigation } = {} as any) {
    return <Pressable onPress={() => {
        navigation.navigate(item.name);
        navigation.closeDrawer();
    }}>
        <Ionicons name={item.icon} size={32} />
        <Text>{item.name}</Text>
    </Pressable>
}

export default function LeftDrawer({ navigation } = {} as any) {
    const state = {
        routes: [
            {
                name: "Mec2",
            },
        ],
    }

    return <View>
        <Header navigation={navigation} />
        <FlatList
            style={{ width: "100%", marginLeft: 30 }}
            data={state.routes}
            renderItem={({ item }) => <Item item={item} navigation={navigation} />}
            keyExtractor={item => item.name}
        />
    </View>
};

const styles = StyleSheet.create({
    header: {
        top: 0,
        width: "100%",
        height: 60,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20
    },
});