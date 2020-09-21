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

export default function RadioSelect(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [value, setValue] = React.useState(props.selected || props.options[0]);

    function handleClose() {
        setAnchorEl(null);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleChange = (event) => {
        setValue(event.target.value);
        props.onChange(event.target.value);
        handleClose();
    };

    return <div>
        <Button
            style={{ textTransform: 'lowercase' }}
            onClick={handleClick}>
            {value}
        </Button>
        <Menu anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            <FormControl>
                <FormLabel style={{ padding: 10 }}>{props.title}</FormLabel>
                <RadioGroup value={value} onChange={handleChange}>
                    {props.options.map((o, i) =>
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