import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { IMec2Cell, IMec2CellProperty } from "../../Utils/Mec2Cell";

export default function Mec2AddNode(args: IMec2Cell) {
    const [active, setActive] = React.useState(false);
    const [state, setState] = React.useState(Object.keys(args.mec2cell)
        .reduce((a: any, c) => { a[c] = null; return a }, {}));

    return <View style={styles.centeredView}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={active}
            onRequestClose={() => setActive(!active)}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text>Add object to {args.name}</Text>
                    {Object.keys(state).map((key: any) => <View style={styles.row}>
                        <Text>{key}: </Text>
                        {args.mec2cell[key]({
                            property: key,
                            elm: state,
                            update: (v: any) => setState({ ...state, [key]: v })
                        })}
                    </View>)}
                </View>
            </View>
        </Modal>
        <Pressable
            style={styles.button}
            onPress={() => setActive(true)} >
            <Text style={styles.textStyle}>Add Node</Text>
        </Pressable>
    </View>
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "row",
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
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