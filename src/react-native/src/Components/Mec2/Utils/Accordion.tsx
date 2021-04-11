import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Accordion({ title, children } = { title: "", children: [] as any }) {
    const [open, setOpen] = React.useState(false);
    const animation = React.useRef(new Animated.Value(0)).current;
    const [contentHeight, setContentHeight] = React.useState(0);

    const bodyHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, contentHeight],
    });

    const arrowAngle = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [`${0}rad`, `${Math.PI}rad`],
    });

    const toggleOpen = () => {
        Animated.timing(animation, {
            duration: 300,
            toValue: open ? 0 : 1,
            easing: Easing.bezier(0.645, 0.045, 0.355, 1),
            useNativeDriver: true,
        }).start();
        setOpen(!open);
    }

    return <View>
        <TouchableOpacity onPress={toggleOpen}>
            <View style={styles.title}>
                <Text>{title}</Text>
                <Animated.View style={{ transform: [{ rotateZ: arrowAngle }] }}>
                    <Ionicons name="arrow-down" size={20} color="black" />
                </Animated.View>
            </View>
        </TouchableOpacity>
        <Animated.View style={{ overflow: 'hidden', height: bodyHeight }}>
            <View style={styles.body} onLayout={e => setContentHeight(e.nativeEvent.layout.height as any)}>
                {children}
            </View>
        </Animated.View>
    </View>
}

const styles = StyleSheet.create({
    title: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#efefef',
        paddingHorizontal: 20,
    },
    body: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        position: 'absolute',
        bottom: 0,
    },
});