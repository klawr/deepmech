import React from 'react';
import { useDispatch } from 'react-redux';
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
import { mecAction } from '../../Features';
import { RadioSelect } from '..'

export default function AddConstraint({ options }) {
    const dispatch = useDispatch();

    const [open, setOpen] = React.useState(false);

    const [CN, setCN] = React.useState({
        id: "", p1: options[0], p2: options[1],
        len: 'const', ori: 'free'
    });

    function handleClickOpen() {
        setOpen(true)
    }

    function handleClickClose() {
        setOpen(false);
    }

    function Accept() {
        dispatch(mecAction.add({
            list: 'constraints', idx: 'add',
            value: {
                ...CN,
                len: { type: CN.len },
                ori: { type: CN.ori }
            }, previous: {}
        }));
        setOpen(false);
    }

    return <div>
        <Button onClick={handleClickOpen}> Add Constraint </Button>
        <Dialog open={open} fullWidth={true} maxWidth="lg">
            <DialogTitle>Add Constraint</DialogTitle>
            <DialogContent>
                <Grid container direction="row">
                    <TextField label="id" value={CN.id}
                        onChange={(e) => setCN({ ...CN, id: e.target.value })} />
                    <RadioSelect
                        title="p1" selected={CN.p1}
                        onChange={(e) => setCN({ ...CN, p1: e })}
                        options={options} />
                    <RadioSelect
                        title="p2" selected={CN.p2}
                        onChange={(e) => setCN({ ...CN, p2: e })}
                        options={options} />
                    <RadioSelect
                        title="len" selected={CN.len}
                        onChange={(e) => setCN({ ...CN, len: { type: e } })}
                        options={['const', 'free', 'drive']} />
                    <RadioSelect
                        title="ori" selected={CN.ori}
                        onChange={(e) => setCN({ ...CN, ori: { type: e } })}
                        options={['const', 'free', 'drive']} />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={Accept}> Accept </Button>
                <Button onClick={handleClickClose}> Close </Button>
            </DialogActions>
        </Dialog>
    </div>
}