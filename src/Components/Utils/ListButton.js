import React from 'react';
import { IconButton, ListItem, Tooltip } from '@material-ui/core';

export default function ListButton({ className, tooltip, onClick, enabled = true, children }) {
    return <div className={className}>
        <ListItem disabled={!enabled} style={{ padding: 10, pointerEvents: 'all' }}>
            <Tooltip title={tooltip}>
                <span>
                    <IconButton disabled={!enabled} onClick={onClick}>
                        {children}
                    </IconButton>
                </span>
            </Tooltip>
        </ListItem>
    </div>
}