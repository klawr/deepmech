import { Ionicons } from "@expo/vector-icons";
import { IMecPlugIns } from "mec2-module";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { mecModelAction } from "../../../Redux/MecModelSlice";
import { IMec2Cell } from "../Utils/Mec2Cell";

export default function Mec2AddElement({ args, text }: { args: IMec2Cell, text: string }) {
    const dispatch = useDispatch();

    const [active, setActive] = React.useState(false);

    function resetObject(o: Object) {
        return Object.keys(o).reduce((a: any, c) => {
            a[c] = null;
            return a;
        }, {});
    }

    const [state, setState] = React.useState(resetObject(args.mec2cell));


    function submit() {
        dispatch(mecModelAction.add({
            list: args.name as keyof IMecPlugIns,
            idx: -1,
            value: state
        }));
        setActive(false);
        setState(resetObject(state));
    }

    return <View style={styles.centeredView}>
        <Modal
            animationType="slide"
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
                    <Text>{text}</Text>
                    {Object.keys(state).map((key: any, idx: number) => <View
                        key={`addElement_${idx}`}
                        style={styles.row}>
                        <Text style={styles.rowText}>{key}: </Text>
                        {args.mec2cell[key]({
                            property: key,
                            elm: state,
                            update: (v: any) => setState({ ...state, [key]: v })
                        })}
                    </View>)}
                    <Pressable
                        style={styles.button}
                        onPress={submit}>
                        <Text style={styles.textStyle}>Submit</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
        <Pressable
            style={styles.button}
            onPress={() => setActive(true)} >
            <Text style={styles.textStyle}>{text}</Text>
        </Pressable>
    </View>
}

const styles = StyleSheet.create({
    rowText: {
        width: 30,
        marginHorizontal: 20,
    },
    row: {
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    closeButton: {
        flexDirection: "row-reverse",
        position: "absolute",
        top: 10,
        right: 10,
    },
    modalView: {
        marginHorizontal: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
    },
    button: {
        padding: 10,
        color: '#efefef',
    },
    textStyle: {
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});