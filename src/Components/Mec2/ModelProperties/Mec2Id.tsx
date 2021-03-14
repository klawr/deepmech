import "../Mec2.css";
import { TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { mecModelAction, mecModelSelect } from '../../../Redux/MecModelSlice';

export default function Mec2Id() {
    const dispatch = useDispatch();
    const selectedId = useSelector(mecModelSelect).id;

    return <TextField className="id"
            label="Id" defaultValue={selectedId}
            onChange={(e) => { dispatch(mecModelAction.updateId(e.target.value)) }} />
}