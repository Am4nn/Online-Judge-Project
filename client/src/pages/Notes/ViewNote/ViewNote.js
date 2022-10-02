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

const ViewNote = ({ openModal, setOpenModal, viewNote, setEditNote, setOpenEditModal }) => {

    const { username, title, desc, access, editable, codeid, language } = viewNote;

    const dispatch = useDispatch();
    const { username: realUsername } = useSelector(state => state.auth);

    const [code, setCode] = useState('');
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
    }

    return (
        <Fragment>
            <ConfirmationDialog open={openDeleteModal} setOpen={setOpenDeleteModal} handleDeleteOperation={handleDelete} />
            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                scroll='paper'
                aria-labelledby="View-Note"
                fullWidth
                maxWidth='md'
                TransitionComponent={Zoom}
            >
                <DialogTitle style={{ textTransform: 'capitalize' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>View Note</span>
                        <div>
                            <Tooltip TransitionComponent={Zoom} title='Edit' placement='bottom'>
                                <Fab onClick={handleEdit} size="small" color="info" aria-label="edit">
                                    <Edit />
                                </Fab>
                            </Tooltip>
                            <Tooltip TransitionComponent={Zoom} title='Delete' placement='bottom'>
                                <Fab onClick={() => setOpenDeleteModal(true)} size="small" color="warning" aria-label="delete" sx={{ ml: 1 }}>
                                    <Delete />
                                </Fab>
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
                            <div style={{ fontWeight: 600, fontSize: '1.1rem', opacity: 0.7 }}>Language : {language}</div>
                        </div>
                        <CodeEditorv3
                            code={code}
                            setCode={setCode}
                            language={language}
                            fontSize={15}
                            isReadOnly
                            isLoading
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
