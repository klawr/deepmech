import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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