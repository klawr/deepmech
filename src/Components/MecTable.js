import React from 'react';

import InputBase from '@material-ui/core/InputBase';
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

    function SanitizedValue(props) {
        if (typeof val === "object") {
            return <InputBase
                style={{ width: 40 }}
                value={JSON.stringify(props.value)} />
        }
        else {
            return <InputBase
                style={{ width: 40 }}
                value={props.value.toString()} />
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
                                <SanitizedValue value={val[1]}/>
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
}