import {
    Button,
    FormControl,
    FormControlLabel,
    Checkbox,
    FormGroup,
    Menu,
} from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import React from 'react';

export default function MultiSelect({ options, updateOptions }: any) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    function handleClose() {
        setAnchorEl(null);
    }

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
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
                    {Object.entries(options).map((o: any, i: number) =>
                        <FormControlLabel key={i} style={{ padding: 10 }} label={o[0]}
                            control={<Checkbox
                                style={{ paddingLeft: 10, paddingRight: 10 }}
                                onChange={(e) => updateOptions(e, o[0])}
                                checked={o[1]}/>} // TODO  label={o[0]}
                        />)}
                </FormGroup>
            </FormControl>
        </Menu>
    </div>
}