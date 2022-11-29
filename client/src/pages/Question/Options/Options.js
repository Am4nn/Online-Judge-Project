import Settings from '@mui/icons-material/Settings'
import { Button, Drawer, Fab, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { Fragment, useState } from 'react'
import InputSlider from '../../../compenents/InputSlider/InputSlider'
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import classes from './Options.module.css';

const Options = props => {

    const {
        favStyle,
        resetCode,
        showCorrectCode,
        codeFontSize,
        selectedLang,
        codeEditable,
        setcodeFontSize,
        setSelectedLang,
        correctCodeAvailable
    } = props;

    const [drawerOpen, toggleDrawerOpen] = useState(false);

    return (
        <Fragment>
            <Fab style={favStyle} onClick={() => toggleDrawerOpen(prev => !prev)} color="secondary" aria-label="add">
                <div className={classes.optionSnippet}
                    style={{
                        top: '-1.5rem',
                        whiteSpace: 'nowrap',
                        textTransform: 'lowercase'
                    }}
                >
                    &#60; change lang, font size, ... /&#62;
                </div>
                <Settings />
            </Fab>
            <Drawer
                anchor='right'
                open={drawerOpen}
                onClose={() => toggleDrawerOpen(false)}
            >
                <div style={{ width: '15rem', margin: '1rem' }}>
                    <h1 className={classes.optionHeading} >Options</h1>


                    <div className={classes.fontSnippet}>
                        &#60; Font Size /&#62;
                    </div>
                    <div className={classes.changeFont}>
                        <InputSlider codeFontSize={codeFontSize} setcodeFontSize={setcodeFontSize} />
                    </div>
                    {codeEditable &&
                        <Fragment>
                            <div className={classes.changeLang}>
                                <FormControl>
                                    <InputLabel id="changeLang-select-label">Language</InputLabel>
                                    <Select
                                        labelId="changeLang-select-label"
                                        id="changeLang-select"
                                        value={selectedLang}
                                        label="Language"
                                        style={{ width: '8em', height: '2.8em' }}
                                        onChange={e => setSelectedLang(e.target.value)}
                                    >
                                        <MenuItem value={'c'}>C</MenuItem>
                                        <MenuItem value={'cpp'}>Cpp</MenuItem>
                                        <MenuItem value={'py'}>Python</MenuItem>
                                        <MenuItem value={'java'}>Java</MenuItem>
                                        <MenuItem value={'js'}>Js</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            <div className={classes.resetCode}>
                                <Button color="error" onClick={() => { resetCode(); toggleDrawerOpen(false); }} variant='contained' startIcon={
                                    <RestartAltIcon fontSize='large' style={{ marginRight: '0.5em', fontSize: '2em' }} />
                                } style={{ textTransform: 'capitalize' }}>
                                    ResetCode
                                </Button>
                            </div>
                            {correctCodeAvailable &&
                                <Button color="info" onClick={() => { showCorrectCode(); toggleDrawerOpen(false); }} variant='contained' startIcon={
                                    <RestartAltIcon fontSize='large' style={{ marginRight: '0.5em', fontSize: '2em' }} />
                                } style={{ textTransform: 'capitalize' }}>
                                    ShowCorrectCode.<span style={{ textTransform: 'lowercase' }}>{selectedLang}</span>
                                </Button>
                            }
                        </Fragment>
                    }
                </div>
            </Drawer>
        </Fragment>
    )
}

export default Options