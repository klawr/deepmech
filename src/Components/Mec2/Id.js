import React from 'react';
import { ListItem, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { actionMec, selectMec } from '../../Features';

export default function Id() {
    const dispatch = useDispatch();
    const selectedId = useSelector(selectMec).id;

    return <ListItem>
        <TextField
            label="Id" defaultValue={selectedId}
            onChange={(e) => { dispatch(actionMec.updateId(e.target.value)) }} />
    </ListItem>
}