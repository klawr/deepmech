import React from 'react';
import { IconButton, ListItem, Tooltip } from '@material-ui/core';

export default function ListButton({className, tooltip, onClick, children}) {
    return <div className={className}>
        <ListItem style={{ padding: 10, pointerEvents: 'all' }}>
            <Tooltip title={tooltip}>
                <IconButton onClick={onClick}>
                    {children}
                </IconButton>
            </Tooltip>
        </ListItem>
    </div>
}