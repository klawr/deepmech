import React from 'react';

import {
    Button,
    FormControl,
    FormControlLabel,
    Checkbox,
    FormGroup,
    Menu,
} from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';

export default function MultiSelect({ options, updateOptions }) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    function handleClose() {
        setAnchorEl(null);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleChange = (event, label) => {
        updateOptions({ ...options, [label]: event.target.checked });
    };

    return <div>
        <Button
            size='small'
            style={{ position: 'absolute', right: 0, top: "1em" }}
            onClick={handleClick}>
            <KeyboardArrowDown />
        </Button>
        <Menu anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            <FormControl>
                <FormGroup>
                    {Object.entries(options).map((o, i) =>
                        <FormControlLabel key={i} style={{ padding: 10 }} label={o[0]}
                            control={<Checkbox
                                style={{ paddingLeft: 10, paddingRight: 10 }}
                                onChange={(e) => handleChange(e, o[0])}
                                checked={o[1]} label={o[0]} />}
                        />)}
                </FormGroup>
            </FormControl>
        </Menu>
    </div>
}