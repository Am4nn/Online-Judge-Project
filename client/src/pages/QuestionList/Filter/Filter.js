import React, { Fragment } from 'react'
import { useDispatch } from 'react-redux'

import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    Button
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';

import classes from './Filter.module.css'
import { messageActions } from '../../../store/Message/message-slice'

const Filter = props => {

    const { easy,
        medium,
        hard,
        setEasy,
        setMedium,
        setHard,
        loggedIn,
        solved,
        setSolved,
        unsolved,
        setUnsolved
    } = props;

    const dispatch = useDispatch();

    const easyChecked = () => setEasy(prev => !prev);
    const mediumChecked = () => setMedium(prev => !prev);
    const hardChecked = () => setHard(prev => !prev);

    const clearFilter = () => {
        if (!easy && !medium && !hard && !solved && !unsolved) return;
        setEasy(false);
        setMedium(false);
        setHard(false);
        setSolved(false);
        setUnsolved(false);
        dispatch(messageActions.set({
            type: 'warning',
            message: 'All Filters Cleared !'
        }))
    }

    return (
        <Fragment>
            <div className={classes.heading}>Filter</div>

            <div className={classes.clearFilter}>
                <Button color="error" onClick={clearFilter} variant="outlined" endIcon={
                    <DeleteIcon fontSize='large' style={{ fontSize: '2em' }} />
                } style={{ fontFamily: 'PT Serif', fontWeight: '500', textTransform: 'capitalize' }}>
                    <span style={{ fontSize: '1.1rem' }}>Clear-Filter</span>
                </Button>
            </div>

            <div style={{ borderBottom: '1px solid rgba(34, 36, 38, 0.15)' }}>
                <div className={classes.checkboxes}>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={easyChecked}
                                    checked={easy}
                                    sx={{
                                        color: 'hsl(120, 60%, 50%)',
                                        '&.Mui-checked': {
                                            color: 'hsl(120, 60%, 50%)',
                                        }
                                    }} />}
                            label="Easy"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={mediumChecked}
                                    checked={medium}
                                    sx={{
                                        color: 'hsl(240, 60%, 50%)',
                                        '&.Mui-checked': {
                                            color: 'hsl(240, 60%, 50%)',
                                        }
                                    }} />}
                            label="Medium"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={hardChecked}
                                    checked={hard}
                                    sx={{
                                        color: 'hsl(0, 60%, 50%)',
                                        '&.Mui-checked': {
                                            color: 'hsl(0, 60%, 50%)',
                                        }
                                    }} />}
                            label="Hard"
                        />
                    </FormGroup>
                </div>
            </div>

            {loggedIn &&
                <div style={{ borderBottom: '1px solid rgba(34, 36, 38, 0.15)' }}>
                    <div className={classes.checkboxes}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={() => setSolved(prev => !prev)}
                                        checked={solved}
                                        sx={{
                                            color: '#0288d1',
                                            '&.Mui-checked': {
                                                color: '#0288d1'
                                            }
                                        }}
                                    />}
                                label="Solved"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={() => setUnsolved(prev => !prev)}
                                        checked={unsolved}
                                        sx={{
                                            color: '#0288d1',
                                            '&.Mui-checked': {
                                                color: '#0288d1'
                                            }
                                        }}
                                    />}
                                label="Unsolved"
                            />
                        </FormGroup>
                    </div>
                </div>
            }
        </Fragment >
    )
}

export default Filter;