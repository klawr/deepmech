import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

export default function Button(props) {
    return <div className={props.className}>
        <Tooltip title={props.tooltip}>
            <IconButton onClick={props.onClick}>
                {props.children}
            </IconButton>
        </Tooltip>
    </div>
}