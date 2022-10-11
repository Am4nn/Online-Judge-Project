import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import {
    Table,
    Paper,
    Button,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    TableContainer,
    TablePagination,
} from '@mui/material';

import moment from 'moment';
import classes from './LeaderTable.module.css'
import CodeIcon from '@mui/icons-material/Code';

const columns = [
    {
        id: 'quesName',
        label: 'Question Name',
        align: 'center',
    },
    {
        id: 'username',
        label: 'Username',
        align: 'center'
    },
    {
        id: 'status',
        label: 'Status',
        align: 'center'
    },
    {
        id: 'msg',
        label: 'Message',
        align: 'center'
    },
    {
        id: 'time',
        label: 'Total Time(s)',
        align: 'center',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'language',
        label: 'Language',
        align: 'center',
    },
    {
        id: 'submitTime',
        label: 'Submit Time',
        align: 'center',
    },
    {
        id: 'code',
        label: 'Code',
        align: 'center'
    }
];

const createData = leaders => {
    let { quesName, status, language, submitTime, completeTime, startTime, quesId, output, username, codeId } = leaders;

    // if some of data is missing then fix them with some default values
    (quesName === undefined || quesName === null) && (quesName = 'Binary Search');
    (quesId === undefined || quesId === null) && (quesId = '62d2def98f76467879c21e29');
    (username === undefined || username === null) && (username = 'guest');

    const time = Math.abs(new Date(completeTime) - new Date(startTime)) / 1000;
    submitTime = moment(submitTime).fromNow();
    status === 'pending' ? (status = 'Pending') : (status === 'success' ? (status = 'Accepted') : (status = 'Rejected'));

    return { quesName, status, language, time, submitTime, quesId, msg: ((!output || !output.msg) ? 'NA' : output.msg), username, codeId };
}

const LeaderTable = props => {
    const { leaders } = props;
    const NavigateFunction = useNavigate();

    const rows = leaders.map(createData);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: '80vh' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, backgroundColor: 'rgb(38, 45, 51)', color: 'rgba(240,240,240, 0.9)' }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={index}
                                        className={classes[(row.status === 'Accepted' ? 'succRow' : (row.status === 'Rejected' ? 'errRow' : ''))]}
                                    >
                                        {columns.map(column => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    role={column.id === 'quesName' ? 'link' : 'cell'}
                                                    onClick={column.id === 'quesName' ? () => NavigateFunction(`/questions/${row.quesId}`) : null}
                                                    className={classes[(column.id === 'quesName' ? 'quesRow' : '')]}
                                                >
                                                    {column.id === 'code' ? (
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => NavigateFunction(`/codes/${row.quesId}${row.codeId ? ('?codeId=' + row.codeId) : ''}`)}
                                                        >
                                                            <CodeIcon />
                                                        </Button>
                                                    ) : (
                                                        column.format
                                                            ? column.format(value)
                                                            : value
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 30, 50, 80, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper >
    );
}

export default LeaderTable;