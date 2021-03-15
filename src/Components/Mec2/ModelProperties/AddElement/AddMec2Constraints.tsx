import React from 'react';
import { useDispatch } from 'react-redux';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
} from '@material-ui/core';
import { mecModelAction } from '../../../../Redux/MecModelSlice';
import RadioSelect from '../../../Utils/RadioSelect'
import mecModelSingleton, { ConstraintMode, IConstraint } from '../../../../Services/Singletons/mecModel';

export default function AddMec2Constraint() {
    const dispatch = useDispatch();

    const options = mecModelSingleton().nodes.map(n => n.id);

    const [open, setOpen] = React.useState(false);
    const [constraint, setConstraint] = React.useState({
        id: "", p1: options[0], p2: options[1],
        len: { type: 'const' }, ori: { type: 'free' }
    } as IConstraint);

    function handleClickOpen() {
        setOpen(true)
    }

    function handleClickClose() {
        setOpen(false);
    }

    function Accept() {
        dispatch(mecModelAction.add({
            list: 'constraints', idx: 'add',
            value: {
                ...constraint,
                len: { type: constraint.len },
                ori: { type: constraint.ori }
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
                    <TextField label="id" value={constraint.id}
                        onChange={(e) => setConstraint({ ...constraint, id: e.target.value })} />
                    <RadioSelect
                        title="p1" selected={constraint.p1}
                        onChange={(e: string) => setConstraint({ ...constraint, p1: e })}
                        options={options} />
                    <RadioSelect
                        title="p2" selected={constraint.p2}
                        onChange={(e: string) => setConstraint({ ...constraint, p2: e })}
                        options={options} />
                    <RadioSelect
                        title="len" selected={constraint.len.type}
                        onChange={(e: ConstraintMode) => setConstraint({ ...constraint, len: { type: e } })}
                        options={['const', 'free', 'drive']} />
                    <RadioSelect
                        title="ori" selected={constraint.ori.type}
                        onChange={(e: ConstraintMode) => setConstraint({ ...constraint, ori: { type: e } })}
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