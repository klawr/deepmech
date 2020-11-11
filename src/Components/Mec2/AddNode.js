import React from 'react';
import { useDispatch } from 'react-redux';
import { mecAction } from '../../Features';
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

export default function AddNode() {
    const dispatch = useDispatch();

    const [open, setOpen] = React.useState(false);

    const [AN, setAN] = React.useState({
        id: "", x: 0, y: 0, base: false
    });

    function handleClickOpen() {
        setOpen(true)
    }

    function handleClickClose() {
        setOpen(false);
    }

    function Accept() {
        dispatch(mecAction.add({
            list: 'nodes', idx: 'add',
            value: { ...AN }, previous: {}
        }));
        setOpen(false);
    }

    return <div>
        <Button onClick={handleClickOpen}> Add Node </Button>
        <Dialog open={open} fullWidth={true} maxWidth="lg">
            <DialogTitle>Add Node</DialogTitle>
            <DialogContent>
                <Grid container direction="row">
                    <TextField label="id" value={AN.id}
                        onChange={(e) => setAN({ ...AN, id: e.target.value })} />
                    <TextField label="x" value={AN.x}
                        onChange={(e) => setAN({ ...AN, x: e.target.value })} />
                    <TextField label="y" value={AN.y}
                        onChange={(e) => setAN({ ...AN, y: e.target.value })} />
                    <p>base</p> 
                    <Checkbox label="base" checked={AN.base}
                        onChange={(e) => setAN({ ...AN, base: e.target.checked })} />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={Accept}> Accept </Button>
                <Button onClick={handleClickClose}> Close </Button>
            </DialogActions>
        </Dialog>
    </div>
}