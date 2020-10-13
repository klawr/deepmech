import React from 'react';
import { ListItem, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { mecAction, mecSelect } from '../../Features';

export default function Id() {
    const dispatch = useDispatch();
    const selectedId = useSelector(mecSelect).id;

    return <ListItem>
        <TextField
            label="Id" defaultValue={selectedId}
            onChange={(e) => { dispatch(mecAction.updateId(e.target.value)) }} />
    </ListItem>
}