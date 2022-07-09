import React, { Fragment } from 'react'
import classes from './Filter.module.css'

import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import { Button } from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete';

const Filter = props => {

    const { easy, medium, hard, setEasy, setMedium, setHard } = props;

    const easyChecked = () => setEasy(prev => !prev);
    const mediumChecked = () => setMedium(prev => !prev);
    const hardChecked = () => setHard(prev => !prev);
    const clearFilter = () => {
        setEasy(false);
        setMedium(false);
        setHard(false);
    }

    return (
        <Fragment>
            <div className={classes.heading}>Filter</div>

            <div className={classes.clearFilter}>
                <Button color="error" onClick={clearFilter} variant="outlined" startIcon={
                    <DeleteIcon fontSize='large' style={{ marginRight: '0.5em', fontSize: '2em' }} />
                }>
                    ClearFilter
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
        </Fragment>
    )
}

export default Filter;