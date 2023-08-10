import React, { useRef, useState } from 'react'

import { ClickAwayListener, Fab, Paper, Popper, Tooltip, Zoom } from '@mui/material';
import Coffee from '@mui/icons-material/Coffee';
import { Box } from '@mui/system';
import Footer from './Footer/Footer';

const FooterFAB = () => {

    const [isExpanded, setExpanded] = useState(false)
    const fabRef = useRef(null);

    return (
        <ClickAwayListener onClickAway={() => setExpanded(false)}>
            <Box>
                <Tooltip
                    placement='top'
                    TransitionComponent={Zoom}
                    title='About Me'
                >
                    <Fab
                        size='large'
                        ref={fabRef}
                        aria-label="footer"
                        onClick={() => setExpanded(prev => !prev)}
                        style={{
                            position: 'fixed',
                            bottom: '1em',
                            left: '1em',
                            opacity: '0.85',
                            backgroundColor: '#ffd43b'
                        }}
                    >
                        <Coffee fontSize='large' />
                    </Fab>
                </Tooltip>
                <Popper
                    open={isExpanded}
                    anchorEl={fabRef.current}
                    placement={'right'}
                    transition
                    style={{ zIndex: '999' }}
                >
                    {({ TransitionProps }) => (
                        <Zoom {...TransitionProps} timeout={350}>
                            <Paper
                                elevation={5}
                                sx={{ margin: '0.5rem', zIndex: '5' }}
                            >
                                <Box sx={{ p: 2 }}>
                                    <Footer />
                                </Box>
                            </Paper>
                        </Zoom>
                    )}
                </Popper>
            </Box>
        </ClickAwayListener>
    );
}

export default FooterFAB;