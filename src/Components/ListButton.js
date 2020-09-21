import React from 'react';
import { IconButton, ListItem, Tooltip } from '@material-ui/core';

export default function ListButton(props) {
    return <div className={props.className}>
        <ListItem style={{ padding: 10 }}>
            <Tooltip title={props.tooltip}>
                <IconButton onClick={props.onClick}>
                    {props.children}
                </IconButton>
            </Tooltip>
        </ListItem>
    </div>
}