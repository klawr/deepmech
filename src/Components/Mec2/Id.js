import React from 'react';
import { ListItem, TextField } from '@material-ui/core';

export default function Id({ mec2 }) {
    return <ListItem>
        <TextField
            label="Id" value={mec2._model.id}
            onChange={(e) => mec2._model.id = e.target.value} />
    </ListItem>
}