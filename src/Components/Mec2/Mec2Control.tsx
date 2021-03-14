import { List } from "@material-ui/core";
import { ArrowDownward, Clear, Pause, PlayArrow, RotateLeft } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { mecModelAction, mecModelSelect } from "../../Redux/MecModelSlice";
import ListButton from "../Utils/ListButton";

export default function MecControl() {
    const dispatch = useDispatch();
    const mec = useSelector(mecModelSelect);

    return <List>
        <ListButton
            tooltip="Run/Pause mechanism"
            onClick={() => dispatch(mecModelAction.pause(true))}>
            {mec.pausing ? <PlayArrow /> : <Pause />}
        </ListButton>
        <ListButton onClick={() => dispatch(mecModelAction.toggleGravity())} tooltip="Toggle gravity">
            g {mec.gravity ? <Clear /> : <ArrowDownward />}
        </ListButton>
        <ListButton onClick={() => "TODO"} tooltip="Reset">
            <RotateLeft />
        </ListButton>
    </List >
}
