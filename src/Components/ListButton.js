import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import Tooltip from '@material-ui/core/Tooltip';

export default function ListButton(props) {
    return <div className={props.className}>
        <ListItem>
            <Tooltip title={props.tooltip}>
                <IconButton onClick={props.onClick}>
                    {props.children}
                </IconButton>
            </Tooltip>
        </ListItem>
    </div>
}