import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';

export default function MecTable(props) {
    return <TableContainer style={{ maxWidth: globalThis.innerWidth - 30 }}>
        <Table>
            <TableHead>
                <TableRow>
                    {props.head.map(key =>
                        <TableCell key={key}> <b>{key}</b> </TableCell>)}
                </TableRow>
            </TableHead>
            <TableBody>
                {props.list.map((elm, idx) => (
                    <TableRow key={idx}>
                        {props.head.map(prop => (
                            <TableCell key={prop}>
                                <props.SanitizedCell title={prop} value={elm[prop]} />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
}