import React from 'react';
import { ListItem, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { updateId, selectId } from '../../Features';

export default function Id() {
    const dispatch = useDispatch();
    const selectedId = useSelector(selectId);

    return <ListItem>
        <TextField
            label="Id" defaultValue={selectedId}
            onChange={(e) => { dispatch(updateId(e.target.value)) }} />
    </ListItem>
}