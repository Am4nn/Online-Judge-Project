import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';

import {
    Snackbar, Slide,
    Alert, IconButton,
    Popper, Paper,
    Typography, Zoom
} from '@mui/material';
import { ExpandMore, ExpandLess, Close } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const SlideTransition = props => {
    return <Slide {...props} direction="left" />;
}

const Actions = ({ handleClose, description, isExpanded, setExpanded }) => {
    return (
        <React.Fragment>
            {description &&
                <IconButton
                    aria-label="expand"
                    color="inherit"
                    sx={{ padding: '5px' }}
                    onClick={() => setExpanded(prev => !prev)}
                >
                    {isExpanded ?
                        <ExpandLess sx={{ width: '20px', height: '20px' }} /> :
                        <ExpandMore sx={{ width: '20px', height: '20px' }} />
                    }
                </IconButton>
            }
            <IconButton
                aria-label="close"
                color="inherit"
                sx={{ padding: '5px' }}
                onClick={handleClose}
            >
                <Close sx={{ width: '20px', height: '20px' }} />
            </IconButton>
        </React.Fragment>
    )
}

const Message = () => {
    const [snackPack, setSnackPack] = useState([]);
    const [open, setOpen] = useState(false);
    const [messageInfo, setMessageInfo] = useState(undefined);
    const [isExpanded, setExpanded] = useState(false);

    const msgRef = useRef(null);
    const messageState = useSelector(state => state.message);

    useEffect(() => {
        if (snackPack.length && !messageInfo) {
            // Set a new snack when we don't have an active one
            setMessageInfo({ ...snackPack[0] });
            setSnackPack((prev) => prev.slice(1));
            setOpen(true);
        } else if (snackPack.length && messageInfo && open) {
            // Close an active snack when a new one is added
            setOpen(false);
        }
    }, [snackPack, messageInfo, open]);

    useEffect(() => {
        setExpanded(false);
        if (!messageState.message || !messageState.type) return;
        setSnackPack((prev) => [...prev, {
            message: messageState.message,
            type: messageState.type,
            description: messageState.description,
            key: new Date().getTime()
        }]);
    }, [messageState]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setExpanded(false);
        setOpen(false);
    };

    const handleExited = () => {
        setMessageInfo(undefined);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Snackbar
                open={open}
                ref={msgRef}
                onClose={handleClose}
                autoHideDuration={3500}
                sx={{ translate: '0 2.5rem' }}
                TransitionComponent={SlideTransition}
                TransitionProps={{ onExited: handleExited }}
                key={messageInfo ? messageInfo.key : undefined}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    elevation={6}
                    severity={messageInfo ? messageInfo.type : "warning"}
                    variant="filled"
                    onClose={handleClose}
                    sx={{ width: '100%' }}
                    action={
                        <Actions
                            isExpanded={isExpanded}
                            setExpanded={setExpanded}
                            handleClose={handleClose}
                            description={messageInfo?.description}
                        />
                    }
                >
                    {messageInfo ? messageInfo.message : undefined}
                </Alert>
            </Snackbar>
            <Popper
                open={isExpanded}
                anchorEl={msgRef.current}
                placement={'bottom'}
                transition
                style={{ zIndex: 1400 }}
            >
                {({ TransitionProps }) => (
                    <Zoom {...TransitionProps} timeout={350}>
                        <Paper
                            elevation={6}
                            sx={{ margin: '0.5rem' }}
                        >
                            <Typography sx={{ p: 2 }}>
                                {(messageInfo && messageInfo.description) ? messageInfo.description : ''}
                            </Typography>
                        </Paper>
                    </Zoom>
                )}
            </Popper>
        </ThemeProvider>
    )
}

export default Message;