import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function ModalSelect({ selected, options, onPress, header }:
    { selected: string, options: string[], onPress: (any: any) => void, header: string }) {
    const [active, setActive] = React.useState(false);

    function press(e: any) {
        onPress(e.target.innerText);
    }

    return <View style={styles.centeredView}>
        <Modal
            animationType="fade"
            transparent={true}
            visible={active}
            onRequestClose={() => setActive(!active)}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Pressable
                        style={styles.closeButton}
                        onPress={() => setActive(false)}>
                        <Ionicons name="close" size={20} />
                    </Pressable>
                    <Text style={styles.modalText}>{header}</Text>
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
        backgroundColor: '#000000aa',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    closeButton: {
        flexDirection: "row-reverse",
        position: "absolute",
        top: 10,
        right: 10,
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
