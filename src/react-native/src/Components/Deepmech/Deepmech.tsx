import * as React from 'react';
import { Animated, StyleSheet, PanResponder, Text, View } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import Header from '../Header';

export default function Deepmech({ navigation } = {} as any) {
    const [path, setPath] = React.useState("");

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (_, gestureState) => {
            setPath(path + `M${gestureState.moveX} ${gestureState.moveY} `);
        },
        onPanResponderMove: (_, gestureState) => {
            setPath(path + `L${gestureState.moveX} ${gestureState.moveY} `);
        },
        onPanResponderRelease: () => { }
    });

    return <View style={{ flex: 1 }}>
        <Animated.View style={{ flex: 1 }} {...panResponder.panHandlers}>
            <Svg style={{ flex: 1 }}>
                <Path
                    d={path}
                    stroke="black"
                    fill="none"
                    strokeLinecap='round'
                    strokeWidth={3} />
            </Svg>
        </Animated.View>

        <Header navigation={navigation} />
    </View >
}

const styles = StyleSheet.create({});
