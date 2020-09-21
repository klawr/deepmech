import React from 'react';

import {
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';

export default function MecTable(props) {
    const properties = new Set();

    props.list.forEach(p => Object.keys(p).forEach(k => properties.add(k)));

    function SanitizedTableCell(props) {
        // Custom mec2 properties
        if (props.title === "base") {
            return <TableCell>
                <Checkbox checked={!!props.value}/>
            </TableCell>
        }

        if (typeof props.value === "object") {
            return <TableCell>
                {JSON.stringify(props.value)}
            </TableCell>
        }
        else if (props.value === undefined) {
            return <TableCell></TableCell>
        }
        else {
            return <TableCell>
                {props.value}
            </TableCell>
        }
    }

    return <TableContainer style={{ maxWidth: globalThis.innerWidth - 30 }}>
        <Table>
            <TableHead>
                <TableRow>
                    {Array.from(properties).map(key =>
                        <TableCell key={key}>
                            <b>{key}</b>
                        </TableCell>)}
                </TableRow>
            </TableHead>
            <TableBody>
                {props.list.map((elm, idx) => (
                    <TableRow key={idx}>
                        {Array.from(properties).map(prop => (
                            <SanitizedTableCell
                                title={prop} key={prop} value={elm[prop]} />
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer >
}