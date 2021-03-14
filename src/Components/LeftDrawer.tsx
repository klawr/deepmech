import { Divider, Drawer, List } from "@material-ui/core";
import { Brightness4, ChevronLeft, GitHub, RotateLeft, Storage } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { deepmechAction, deepmechSelect } from "../Redux/DeepmechSlice";
import { mecModelAction } from "../Redux/MecModelSlice";
import { UIAction, UISelect } from "../Redux/UISlice";
import DeepmechControl from "./Deepmech/DeepmechControl";
import logo from "../logo.svg";
import MecControl from "./Mec2/Mec2Control";
import ListButton from "./Utils/ListButton";
import "./Components.css";

export default function LeftDrawer() {
    const dispatch = useDispatch();
    const UI = useSelector(UISelect);
    const deepmech = useSelector(deepmechSelect)

    function toggleDeepmech() {
        dispatch(deepmechAction.active(!deepmech.active));
        if (deepmech.active) {
            dispatch(mecModelAction.pause(true));
        }
    }

    return <Drawer
        open={UI.left}
        anchor="left"
        variant="persistent">
        <List>
            <ListButton
                onClick={() => dispatch(UIAction.left(false))}
                tooltip="Close drawer">
                <ChevronLeft />
            </ListButton>
        </List>
        <div>{deepmech.active ? <DeepmechControl /> : <MecControl />}</div>
        <Divider />
        <ListButton
            onClick={toggleDeepmech}
            tooltip={(deepmech.active ? "Exit" : "Activate") + " deepmech"}>
            {deepmech.active ? <RotateLeft /> : <img width={24} height={24} src={logo} />}
        </ListButton>
        <Divider />
        <List className="bottomButtons">
            {/* TODO <ListButton
                onClick={() => {
                    dispatch(deepmechAction.register({ prediction: true, serverport: 8337 }))
                }}
                tooltip="Activate server prediction">
                <Storage />
            </ListButton> */}
            <ListButton
                onClick={() => {
                    dispatch(mecModelAction.setDarkmode(!UI.darkmode));
                    dispatch(UIAction.darkmode(!UI.darkmode));
                }}
                tooltip="Toggle dark mode">
                <Brightness4 />
            </ListButton>
            <ListButton tooltip="Project page">
                <a href="https://github.com/klawr/deepmech" target="_blank">
                    <GitHub />
                </a>
            </ListButton>
        </List>
    </Drawer>
}