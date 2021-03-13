import React from 'react';

import {
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Menu,
    Button,
} from '@material-ui/core';

export default function RadioSelect({selected, options, title, label, onChange}: any) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [value, setValue] = React.useState(selected || options[0]);

    function handleClose() {
        setAnchorEl(null);
    }

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleChange = (event: any) => {
        setValue(event.target.value);
        onChange(event.target.value);
        handleClose();
    };

    return <div>
        <Button
            style={{ textTransform: 'none' }}
            onClick={handleClick}>
            {label || value}
        </Button>
        <Menu anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            <FormControl>
                <FormLabel style={{ padding: 10 }}>{title}</FormLabel>
                <RadioGroup value={value} onChange={handleChange}>
                    {options.map((o: any, i: number) =>
                        <FormControlLabel
                            key={i}
                            style={{ paddingLeft: 10, paddingRight: 10 }}
                            value={o} label={o}
                            control={<Radio />} />)}
                </RadioGroup>
            </FormControl>
        </Menu>
    </div>
}