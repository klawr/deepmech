import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export default function ModalSelect({ selected, options, onPress }:
    { selected: string, options: string[], onPress: (any: any) => void }) {
    const [active, setActive] = React.useState(false);

    function press(e: any) {
        onPress(e.target.innerText);
    }

    return <View style={styles.centeredView}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={active}
            onRequestClose={() => setActive(!active)}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Hello World!</Text>
                    {options.map(option => <Pressable
                        key={`modalOption${option}`}
                        style={[styles.button, styles.modalButton]}
                        onPress={press}>
                        <Text style={styles.textStyle}>{option}</Text>
                    </Pressable>)}
                </View>
            </View>
        </Modal>
        <Pressable
            style={styles.button}
            onPress={() => setActive(true)} >
            <Text style={styles.textStyle}>{selected}</Text>
        </Pressable>
    </View>
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        padding: 10,
        backgroundColor: '#efefef',
    },
    modalButton: {
        width: 100,
        margin: 10,
    },
    textStyle: {
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});
