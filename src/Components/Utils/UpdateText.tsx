import {
    Button,
    Menu,
    TextField,
} from '@material-ui/core'
import React from 'react';

export default function UpdateText({ title, value, onSubmit }: any) {
    const [val, setValue] = React.useState(value)
    const [anchorEl, setAnchorEl] = React.useState(null);

    function handleClose() {
        setAnchorEl(null);
        onSubmit(val);
    }

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        onSubmit(val);
    }

    return <div>
        <Button
            style={{ textTransform: 'none' }}
            onClick={handleClick}>
            {val}
        </Button>
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            <form onSubmit={handleSubmit}>
                <TextField
                    autoFocus
                    onChange={(e) => { setValue(e.target.value) }}
                    style={{ margin: 10 }}
                    label={title}
                    defaultValue={val} />
            </form>
        </Menu>
    </div>
}