  
import '../Mec2.css';
import { useSelector, useDispatch } from 'react-redux';
import { mecModelAction, mecModelSelect } from '../../../Redux/MecModelSlice';
import ListButton from '../../Utils/ListButton';
import { Redo, Undo } from '@material-ui/icons';
import { Grid } from '@material-ui/core';

export default function Mec2UndoRedo() {
    const dispatch = useDispatch();
    const mecModel = useSelector(mecModelSelect);

    return <div className="undoRedoGrid">
        <ListButton
            tooltip="Undo"
            enabled={mecModel.selected > 0}
            onClick={() => dispatch(mecModelAction.undo())}>
            <Undo />
        </ListButton>
        <ListButton
            tooltip="Redo"
            enabled={mecModel.selected < mecModel.queue.length}
            onClick={() => dispatch(mecModelAction.redo())}>
            <Redo />
        </ListButton>
    </div>

}