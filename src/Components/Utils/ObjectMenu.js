import React from 'react';

import {
    FormControl,
    FormLabel,
    Button,
    Menu,
} from '@material-ui/core';

export default function ObjectMenu({ title, label, children }) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    function handleClose() {
        setAnchorEl(null);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return <div>
        <Button
            style={{ textTransform: 'none' }}
            onClick={handleClick}
        > {title}
        </Button>
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            <FormControl>
                <FormLabel style={{ padding: 10 }}>{label}</FormLabel>
                {children}
            </FormControl>
        </Menu>
    </div>
}
