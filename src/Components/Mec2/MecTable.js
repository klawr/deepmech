import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';

export default function MecTable({head, list, SanitizedCell}) {
    return <TableContainer style={{ maxWidth: globalThis.innerWidth - 30 }}>
        <Table>
            <TableHead>
                <TableRow>
                    {head.map(key =>
                        <TableCell key={key}> <b>{key}</b> </TableCell>)}
                </TableRow>
            </TableHead>
            <TableBody>
                {list.map((elm, idx) => (
                    <TableRow key={idx}>
                        {head.map(prop => (
                            <TableCell key={prop}>
                                <SanitizedCell elm={elm} prop={prop} />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
}