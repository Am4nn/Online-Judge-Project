import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button, DialogContentText,
    Fab, Fade, IconButton, Tooltip,
    Zoom, Dialog, DialogActions,
    DialogContent, DialogTitle, TextField
} from '@mui/material';
import {
    Check, ContentCopy,
    Delete, Edit, Share
} from '@mui/icons-material';
import { Box } from '@mui/system';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import Note from '../Note/Note';
import classes from './ViewNote.module.css';
import { SERVER_LINK } from '../../../dev-server-link';
import CodeEditorv3 from '../../Question/Editor/CodeEditorv3';
import { messageActions } from '../../../store/Message/message-slice';
import LoadingSpinner from './../../../compenents/LoadingSpinner/LoadingSpinner';

const ViewNote = ({ openModal, setOpenModal, viewNote, setEditNote, setOpenEditModal, isMobile, markEditOrDelete, setReloadNeeded, SlideTransition }) => {

    const { username, title, desc, access, editable, codeid, _id: noteid, lastModifiedAt } = viewNote;

    const dispatch = useDispatch();
    const { username: auth_username, isAdmin, isGuest } = useSelector(state => state.auth);

    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('c');
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [copied, setCopied] = useState(false);
    if (copied === true) setTimeout(() => setCopied(false), 2500);
    const [loading, setLoading] = useState(true);

    const handleClose = () => {
        setOpenModal(false);
    };

    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (openModal) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [openModal]);

    useFetchCodeForNote(codeid, noteid, setCode, setLanguage, setLoading);

    const copyHandler = () => {
        const result = copy(code);
        const type = result ? 'success' : 'error';
        const message = result ? 'Code copied successfully !' : 'There are some errors copying the code !';

        dispatch(messageActions.set({ type, message }));
        setCopied(true);
    }

    const handleEdit = () => {
        setEditNote({ ...viewNote, code, language });
        setOpenEditModal(true);
        setOpenModal(false);
    }

    const handleDelete = () => {
        setOpenDeleteModal(false);
        setOpenModal(false);

        // Make a request to server with credentials to delete perticular note
        fetch(
            `${SERVER_LINK}/api/notes/${noteid}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'DELETE',
                credentials: 'include'
            }
        )
            .then(async response => {
                const res = await response.json();
                if (response.ok) return res
                return Promise.reject(res);
            })
            .then(response => {
                dispatch(messageActions.set({ type: 'success', message: 'Deleted Note Successfully !', description: JSON.stringify(response) }));
                markEditOrDelete(noteid, 'deleted');
                setReloadNeeded(true);
            })
            .catch(err => {
                console.error(err);
                dispatch(messageActions.set({ type: 'error', message: 'Deleting Note Unsuccessful!', description: JSON.stringify(err) }));
            })
    }

    const handleShare = () => {
        const link = window.location.href;
        const result = copy(link);
        let type = '';
        let message = '';
        let description = '';

        if (!result) {
            type = 'error'; message = "There are some errors copying the Note's Link !";
            description = 'Try using another browser !';
        } else if (access === 'private') {
            type = 'warning'; message = "Link copied but someone else can't open it as its a Private Note";
            description = 'Make this Note public to make it share-able !';
        } else {
            type = 'success'; message = 'Link to the Note copied successfully !';
            description = `Link to Note : ${link}`;
        }

        dispatch(messageActions.set({ type, message, description }));
    }

    const [codeSubmittingState, setCodeSubmittingState] = useState('not-initialized');
    const [response, setResponse] = useState({ status: 'pending' });
    const [input, setInput] = useState('');
    const endRef = useRef(null);

    useEffect(() => {
        setCode('');
        setInput('');
        setLoading(true);
        setCodeSubmittingState('not-initialized');
        setResponse({ status: 'pending' });
    }, [noteid]);

    const intervalID = useRef(null);
    const stopInterval = useCallback(() => {
        if (intervalID.current) {
            clearInterval(intervalID.current);
            intervalID.current = null;
        }
    }, []);

    useEffect(() => {
        if (intervalID.current)
            setCodeSubmittingState('not-initialized');
        stopInterval();
    }, [openModal, stopInterval]);

    const handleCompile = async event => {

        event.preventDefault();

        if (codeSubmittingState === 'submitting') return;

        setCodeSubmittingState('submitting');
        setResponse({ msg: 'Queueing...', status: 'pending' });

        if (endRef.current)
            endRef.current.scrollIntoView({ behavior: 'smooth' });

        try {
            const query = await fetch(
                `${SERVER_LINK}/api/explore/codeExecutor`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({ code, language, input })
                }
            );
            const queryData = await query.json();
            setResponse(queryData);

            if (query.ok) {
                intervalID.current = setInterval(async () => {
                    const response = await fetch(
                        `${SERVER_LINK}/api/explore/status/${queryData.queryId}`,
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: 'GET'
                        }
                    );
                    const data = await response.json();
                    if (intervalID.current && !response.ok) {
                        stopInterval();
                        setCodeSubmittingState('submitted');
                        setResponse(data);
                    }
                    else if (intervalID.current && data.status !== 'pending') {
                        stopInterval();
                        setCodeSubmittingState('submitted');
                        setResponse({ ...data.output, status: data.status });
                    }
                    // else console.log('status -> pending');
                }, 1000);
            }
            else {
                setCodeSubmittingState('submitted');
            }
        } catch (error) {
            setResponse({ msg: 'caught errors while sending code to server for getting verdict', serverError: JSON.stringify(error) });
            setCodeSubmittingState('submitted');
        }
    }

    const isEditable = (isAdmin || (access !== 'private' && editable) || (!isGuest && (auth_username === username)));
    const isDeleteable = (isAdmin || (!isGuest && (auth_username === username)));

    return (
        <Fragment>
            <ConfirmationDialog open={openDeleteModal} setOpen={setOpenDeleteModal} handleDeleteOperation={handleDelete} />
            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                scroll='paper'
                aria-labelledby="View-Note"
                fullWidth
                maxWidth={!isMobile && 'md'}
                fullScreen={isMobile}
                TransitionComponent={SlideTransition}
            >
                <DialogTitle style={{ textTransform: 'capitalize' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>View Note</span>
                        <div style={{ display: 'flex' }}>
                            <Tooltip TransitionComponent={Zoom} title='Share' placement='bottom'>
                                <Box>
                                    <Fab onClick={handleShare} size="small" color="success" aria-label="share">
                                        <Share />
                                    </Fab>
                                </Box>
                            </Tooltip>
                            <Tooltip TransitionComponent={Zoom} title={(!isEditable) ? "Can't edit this note" : 'Edit'} placement='bottom'>
                                <Box>
                                    <Fab onClick={handleEdit} size="small" color="info" aria-label="edit" sx={{ ml: 1 }} disabled={(!isEditable)}>
                                        <Edit />
                                    </Fab>
                                </Box>
                            </Tooltip>
                            <Tooltip TransitionComponent={Zoom} title={(!isDeleteable) ? "Can't delete this note" : 'Delete'} placement='bottom'>
                                <Box>
                                    <Fab onClick={() => setOpenDeleteModal(true)} size="small" color="warning" aria-label="delete" sx={{ ml: 1 }} disabled={(!isDeleteable)}>
                                        <Delete />
                                    </Fab>
                                </Box>
                            </Tooltip>
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent dividers ref={descriptionElementRef}>
                    <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                        <span style={{ position: 'absolute', top: '-0.8rem', left: '0', fontWeight: 600, opacity: 0.6 }}>Preview :</span>
                        <Note note={{ title, desc, access, editable, username }} />
                    </div>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { mb: 1.3, width: '85%' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                            <div>
                                <Tooltip TransitionComponent={Zoom} title={copied ? 'Code Copied' : 'Copy Code'} placement='right'>
                                    <IconButton
                                        onClick={copyHandler}
                                        aria-label={copied ? 'Code Copied' : 'Copy Code'}
                                    >
                                        {copied ? <Check /> : <ContentCopy />}
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div style={{ fontWeight: 600, fontSize: '1.1rem', opacity: 0.7 }}>Language : {loading ? '...' : language}</div>
                        </div>
                        <CodeEditorv3
                            code={code}
                            setCode={setCode}
                            language={language}
                            fontSize={15}
                            isReadOnly
                            isLoading={loading}
                        />
                    </Box>

                    <TextField
                        id="input-textarea"
                        placeholder="Put Multiline Input here"
                        label='Any Input ?'
                        color='secondary'
                        fullWidth
                        multiline
                        maxRows='3'
                        variant='outlined'
                        sx={{ marginTop: '2rem' }}
                        value={input}
                        onChange={event => setInput(event.target.value)}
                    />
                    {codeSubmittingState !== 'not-initialized' && (
                        <Box className={classes.body}>
                            <div style={{ "--col": (response.status === 'success' ? 127 : 0) }} className={classes.response}>
                                {response.msg &&
                                    <div className={classes.resTextHead}>
                                        <div className={classes.resHead}>Msg: </div>
                                        <div>{response.msg}</div>
                                    </div>
                                }
                                {response.stdout &&
                                    <div className={classes.resTextHead}>
                                        <div className={classes.resHead}>STDOUT: </div>
                                        <div>{response.stdout}</div>
                                    </div>
                                }
                                {response.stderr &&
                                    <div className={classes.resTextHead}>
                                        <div className={classes.resHead}>STDERR: </div>
                                        <div>{response.stderr}</div>
                                    </div>
                                }
                                {response.error &&
                                    <div className={classes.resTextHead}>
                                        <div className={classes.resHead}>Error: </div>
                                        <div>{JSON.stringify(response.error)}</div>
                                    </div>
                                }
                                {response.serverError &&
                                    <div className={classes.resTextHead}>
                                        <div className={classes.resHead}>ServerError: </div>
                                        <div>{response.serverError.toString()}</div>
                                    </div>
                                }
                                {response.status === 'pending' &&
                                    <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <LoadingSpinner />
                                    </div>
                                }
                            </div>
                        </Box>
                    )}
                    <div ref={endRef} style={{ marginTop: '18rem' }} />

                </DialogContent>
                <DialogActions>
                    <div style={{ width: '100%', padding: '6px 8px', textTransform: 'capitalize' }}>
                        <DialogContentText>
                            Last Modified: {moment(lastModifiedAt).fromNow()}
                        </DialogContentText>
                    </div>
                    <Button style={{ textTransform: 'capitalize' }} variant='outlined' color='secondary' onClick={handleCompile}>Compile</Button>
                    <Button style={{ textTransform: 'capitalize' }} variant='outlined' onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog >
        </Fragment>
    );
}

const ConfirmationDialog = ({ open, setOpen, handleDeleteOperation }) => {

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-delete-note"
            TransitionComponent={Fade}
        >
            <DialogTitle>Delete Note</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this note ?
                    <br />
                    (Once Note is Delete can't be recovered !)
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeleteOperation}>Delete</Button>
                <Button onClick={handleClose} autoFocus>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

const useFetchCodeForNote = (codeid, noteid, setCode, setLanguage, setLoading) => {
    useEffect(() => {
        if (!codeid) return;

        // make request to server to fetch code with _id:codeid
        fetch(
            `${SERVER_LINK}/api/notes/${codeid}?noteid=${noteid}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET',
                credentials: 'include'
            }
        )
            .then(async response => {
                const res = await response.json();
                if (response.ok) return res;
                return Promise.reject(res);
            })
            .then(response => {
                setCode(response.code);
                setLanguage(response.language);
            })
            .catch(error => { setCode(JSON.stringify(error)) })
            .finally(() => setLoading(false))
    }, [codeid, noteid, setCode, setLanguage, setLoading]);
}


export default ViewNote;
