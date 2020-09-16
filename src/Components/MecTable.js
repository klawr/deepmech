import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export function MecTable(props) {
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
    
    function sanitizeValue(val) {
        if (typeof val === "object") {
            return JSON.stringify(val);
        }
        else {
            return val.toString();
        }
    }

    return <TableContainer>
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
                            <TableCell key={val[0]}>
                                {sanitizeValue(val[1])}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
}