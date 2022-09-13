import React, { useRef, useState } from 'react'

import { ClickAwayListener, Fab, Paper, Popper, Tooltip, Typography, Zoom } from '@mui/material';
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
                    title='Footer'
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
                            opacity: '0.9',
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
                >
                    {({ TransitionProps }) => (
                        <Zoom {...TransitionProps} timeout={350}>
                            <Paper
                                elevation={5}
                                sx={{ margin: '0.5rem', zIndex: '5' }}
                            >
                                <Typography sx={{ p: 2 }}>
                                    <Footer />
                                </Typography>
                            </Paper>
                        </Zoom>
                    )}
                </Popper>
            </Box>
        </ClickAwayListener>
    );
}

export default FooterFAB;