import { useDispatch } from 'react-redux';
import { mecModelAction } from '../../../../Redux/MecModelSlice';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
} from '@material-ui/core';
import React from 'react';
import { INode } from '../../../../Services/Singletons/mecModel';

export default function AddMec2Node() {
    const dispatch = useDispatch();

    const [open, setOpen] = React.useState(false);
    // AN is for... addnode? might rename this
    const [node, setNode] = React.useState({
        id: "", x: 0, y: 0, base: false
    } as INode);

    function handleClickOpen() {
        setOpen(true)
    }

    function handleClickClose() {
        setOpen(false);
    }

    function Accept() {
        dispatch(mecModelAction.add({
            list: 'nodes', idx: 'add',
            value: (({id, x, y, base}) => ({ id, x: +x, y: +y, base }))(node),
            previous: {}
        }));
        setOpen(false);
    }

    return <div>
        <Button onClick={handleClickOpen}> Add Node </Button>
        <Dialog open={open} fullWidth={true} maxWidth="lg">
            <DialogTitle>Add Node</DialogTitle>
            <DialogContent>
                <Grid container direction="row">
                    <TextField label="id" value={node.id}
                        onChange={(e) => setNode({ ...node, id: e.target.value })} />
                    <TextField label="x" value={node.x}
                        onChange={(e) => setNode({ ...node, x: +e.target.value })} />
                    <TextField label="y" value={node.y}
                        onChange={(e) => setNode({ ...node, y: +e.target.value })} />
                    <p>base</p> 
                    <Checkbox
                        // TODO label="base"
                        checked={node.base}
                        onChange={(e) => setNode({ ...node, base: e.target.checked })} />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={Accept}> Accept </Button>
                <Button onClick={handleClickClose}> Close </Button>
            </DialogActions>
        </Dialog>
    </div>
}