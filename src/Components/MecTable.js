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
    function createHeader(arr) {
        const header = [];
        for (const obj of arr) {
            for (const key of Object.keys(obj)) {
                if (!header.includes(key)) {
                    header.push(key);
                }
            }
        }
        return header;
    }

    function SanitizedTableCell(props) {
        if (typeof props.value === "object") {
            return <TableCell>
                {JSON.stringify(props.value)}
            </TableCell>
        }
        else {
            return <TableCell>
                {props.value.toString()}
            </TableCell>
        }
    }

    return <TableContainer style={{ maxWidth: globalThis.innerWidth - 30 }}>
        <Table>
            <TableHead>
                <TableRow>
                    {createHeader(props.list).map(key => (
                        <TableCell key={key}>
                            <b>{key}</b>
                        </TableCell>))}
                </TableRow>
            </TableHead>
            <TableBody>
                {props.list.map && props.list.map((elm, idx) => (
                    <TableRow key={idx}>
                        {Object.entries(elm).map(val => (
                            <SanitizedTableCell key={val[0]} value={val[1]} />
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer >
}