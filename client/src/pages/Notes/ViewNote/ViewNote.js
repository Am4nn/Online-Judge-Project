import React, { Fragment, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContentText, Fab, Fade, IconButton, Tooltip, Zoom } from '@mui/material';
import { Box } from '@mui/system';
import Note from '../Note/Note';
import { useDispatch, useSelector } from 'react-redux';
import CodeEditorv3 from '../../Question/Editor/CodeEditorv3';
import { Check, ContentCopy, Delete, Edit } from '@mui/icons-material';
import copy from 'copy-to-clipboard';
import { messageActions } from '../../../store/Message/message-slice';
import { SERVER_LINK } from '../../../dev-server-link';

const ViewNote = ({ openModal, setOpenModal, viewNote, setEditNote, setOpenEditModal, isMobile, markEditOrDelete, setReloadNeeded }) => {

    const { username, title, desc, access, editable, codeid, _id: noteid } = viewNote;

    const dispatch = useDispatch();
    const { username: auth_username, isAdmin } = useSelector(state => state.auth);

    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('c');
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [copied, setCopied] = useState(false);
    if (copied === true) setTimeout(() => setCopied(false), 2500);

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


    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!codeid) return;

        // make request to server to fetch code with _id:codeid
        fetch(
            `${SERVER_LINK}/api/notes/${codeid}`,
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
    }, [codeid]);

    const copyHandler = () => {
        const result = copy(code);
        const type = result ? 'success' : 'error';
        const message = result ? 'Code copied successfully !' : 'There are some errors copying the code !';

        dispatch(messageActions.set({ type, message }));
        setCopied(true);
    }

    const handleEdit = () => {
        setEditNote({ ...viewNote, code });
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

    const isEditDisabled = (!editable && !isAdmin && (auth_username !== username));
    const isDeleteDisabled = (!isAdmin && (auth_username !== username));

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
                TransitionComponent={Zoom}
            >
                <DialogTitle style={{ textTransform: 'capitalize' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>View Note</span>
                        <div style={{ display: 'flex' }}>
                            <Tooltip TransitionComponent={Zoom} title={isEditDisabled ? "Can't edit this note" : 'Edit'} placement='bottom'>
                                <Box>
                                    <Fab onClick={handleEdit} size="small" color="info" aria-label="edit" disabled={isEditDisabled}>
                                        <Edit />
                                    </Fab>
                                </Box>
                            </Tooltip>
                            <Tooltip TransitionComponent={Zoom} title={isDeleteDisabled ? "Can't delete this note" : 'Delete'} placement='bottom'>
                                <Box>
                                    <Fab onClick={() => setOpenDeleteModal(true)} size="small" color="warning" aria-label="delete" sx={{ ml: 1 }} disabled={isDeleteDisabled}>
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
                                <Tooltip TransitionComponent={Zoom} title={copied ? 'Copied' : 'Copy'} placement='right'>
                                    <IconButton
                                        onClick={copyHandler}
                                        aria-label={copied ? 'Copied' : 'Copy'}
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

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
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

export default ViewNote;
