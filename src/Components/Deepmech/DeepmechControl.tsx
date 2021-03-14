import { Divider, ListItem, Tooltip } from "@material-ui/core";
import { CameraAlt, Create, Delete, Done, List, PanTool } from "@material-ui/icons";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deepmechAction, deepmechSelect } from "../../Redux/DeepmechSlice";
import ListButton from "../Utils/ListButton";

export default function DeepmechControl() {
    const dispatch = useDispatch();
    const deepmech = useSelector(deepmechSelect);

    function Toggle(elm: any, value: string, tooltip: string, disabled: boolean = false) {
        return <ToggleButton value={value} disabled={disabled}>
            <Tooltip title={tooltip}>
                {elm}
            </Tooltip>
        </ToggleButton>
    }

    return <div>
        <ToggleButtonGroup
            className="deepmechControl"
            exclusive
            orientation="vertical"
            value={deepmech.mode}
            onChange={(e, val) => val && dispatch(deepmechAction.changeMode(val))}>
            {Toggle(<Create />, "draw", "Draw")}
            {Toggle(<PanTool />, "drag", "Drag")}
            {Toggle(<Delete />, "delete", "Delete")}
            {Toggle(<CameraAlt />, "camera", "Camera", true)}
        </ToggleButtonGroup>
        <Divider />
        <ListButton
            onClick={() => dispatch(deepmechAction.predict())}
            tooltip="predict" >
            <Done />
        </ListButton>
    </div>
}
