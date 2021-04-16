import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export default function Confirm({ text, onPress, children, bonusChildren }:
    { text: string, onPress: (args: any) => void, children: any, bonusChildren?: any }) {
    const [active, setActive] = React.useState(false);

    function submit(e: any) {
        onPress(e);
        setActive(false);
    }

    return <View>
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
                    {bonusChildren}
                    <Text style={styles.modalText}>{text}</Text>
                    <View style={styles.buttonRow}>
                        <Pressable
                            style={styles.button}
                            onPress={submit}>
                            <Text>Yes</Text>
                        </Pressable>
                        <Pressable
                            style={styles.button}
                            onPress={() => setActive(false)}>
                            <Text>No</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
        <Pressable onPress={() => setActive(true)} >
            {children}
        </Pressable>
    </View>
}

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
        marginHorizontal: 20,
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
    },
    buttonRow: {
        flexDirection: 'row',
        flex: 1,
    }
});
