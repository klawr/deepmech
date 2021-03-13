import { Grid, List, SwipeableDrawer, Typography } from "@material-ui/core";
import { ChevronRight, Label, Lock, LockOpen } from "@material-ui/icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mecModelAction, mecModelSelect } from "../Features/MecModelSlice";
import { UIAction, UISelect } from "../Features/UISlice";
import ListButton from "./Utils/ListButton";

export default function RightDrawer() {
    const dispatch = useDispatch();

    const mec = useSelector(mecModelSelect);
    const right = useSelector(UISelect).right;

    const [locked, toggleLock] = React.useState(globalThis.innerWidth > 1200);

    window.addEventListener('orientationchange', () => dispatch(UIAction.right(false)));

    return <SwipeableDrawer
        open={right}
        onClose={() => dispatch(UIAction.right(false))}
        onOpen={() => dispatch(UIAction.right(true))}
        variant={locked ? 'persistent' : 'temporary'}
        anchor="right">
        <List>
            <Grid container direction="row">
                <ListButton
                    onClick={() => dispatch(UIAction.right(false))}
                    tooltip="Close drawer">
                    <ChevronRight />
                </ListButton>
                <ListButton tooltip="toggle node labels" onClick={() => dispatch(
                    mecModelAction.setNodeLabels(!mec.nodeLabels))}>
                    <Label /> <Typography>node</Typography>
                </ListButton>
                <ListButton tooltip="toggle constraint labels" onClick={() => dispatch(
                    mecModelAction.setConstraintLabels(!mec.constraintLabels))}>
                    <Label /> <Typography>constraint</Typography>
                </ListButton>
                <ListButton
                    tooltip={(locked ? "Unlock" : "Lock") + " drawer"}
                    onClick={() => toggleLock(!locked)}>
                    {locked ? <Lock /> : <LockOpen />}
                </ListButton>
            </Grid>
        </List>
    </SwipeableDrawer>
}
