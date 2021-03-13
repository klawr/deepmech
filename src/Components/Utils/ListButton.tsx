import { IconButton, ListItem, Tooltip } from '@material-ui/core';

interface IListButton {
    className?: string,
    tooltip: string,
    onClick?: any,
    enabled?: boolean,
    children?: any
}
export default function ListButton({ enabled = true, className, tooltip, onClick = () => undefined, children } = {} as IListButton) {
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