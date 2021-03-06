import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { FlatList, Pressable, Platform, StyleSheet, Text, View } from "react-native";
import { createDrawerNavigator } from 'react-navigation-drawer';
import Mec2 from './Mec2/Mec2';
import Deepmech from './Deepmech/Deepmech';
import Camera from './Deepmech/Camera';

function Header({ navigation } = {} as any) {
    return <View style={styles.header}>
        <Pressable onPress={() => navigation.closeDrawer()}>
            <Ionicons name="arrow-back" size={32} />
        </Pressable>
    </View>
}

function Item({ item, navigation } = {} as any) {
    return <Pressable
        style={styles.listItem}
        onPress={() => {
            navigation.navigate(item.name);
            navigation.closeDrawer();
        }}>
        <Ionicons name={item.icon} size={32} />
        <Text>{item.name}</Text>
    </Pressable>
}

const LeftDrawer = createDrawerNavigator(
    {
        Mec2: { screen: Mec2 },
        Deepmech: { screen: Deepmech, },
        Camera: { screen: Camera, }
    },
    {
        initialRouteName: "Mec2",
        unmountInactiveRoutes: true,
        defaultNavigationOptions: {
            drawerLockMode: 'locked-closed',
        },
        contentComponent: props => <Drawer {...props} />
    }
);
export default LeftDrawer;

function Drawer({ navigation } = {} as any) {
    const state = {
        routes: [
            { name: "Mec2", },
            { name: "Deepmech", },
            { name: "Camera", },
        ],
    }

    return <View style={{ flex: 1 }}>
        <Header navigation={navigation} />
        <FlatList
            style={styles.list}
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
    list: {
        flex: 1,
        marginHorizontal: 30,
    },
    listItem: {
        paddingVertical: Platform.OS === 'web' ? 10 : 0,
    }
});