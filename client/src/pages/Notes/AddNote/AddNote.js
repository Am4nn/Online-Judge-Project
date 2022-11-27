import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    FormControl, FormControlLabel,
    DialogContent, DialogTitle,
    Button, styled, TextField,
    Dialog, DialogActions,
    InputLabel, MenuItem,
    Select, Switch
} from '@mui/material';
import { Box } from '@mui/system';

import CodeEditorv3 from '../../Question/Editor/CodeEditorv3';
import Note from '../Note/Note';
import { SERVER_LINK } from '../../../dev-server-link';
import { messageActions } from '../../../store/Message/message-slice';

const AddNote = ({ openModal, setOpenModal, isMobile, setReloadNeeded, SlideTransition }) => {

    const { username, isAdmin, isGuest } = useSelector(state => state.auth);

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [access, setAccess] = useState('public');
    const [editable, setEditable] = useState(false);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('c');

    const dispatch = useDispatch();

    const resetStates = () => {
        setTitle('');
        setDesc('');
        setAccess('public');
        setEditable(false);
        setCode('');
    }

    const handleClose = () => {
        resetStates();
        setOpenModal(false);
    };

    const handleAdd = () => {
        if (!title || !desc) {
            dispatch(messageActions.set({ type: 'error', message: "title and description can't be empty", description: 'title and description are required so please fill both !!!' }));
            return;
        }

        handleClose();
        dispatch(messageActions.set({ type: 'info', message: 'Adding New Note...' }));
        // send request to server to add note with given info and credentials
        fetch(
            `${SERVER_LINK}/api/notes`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ title, desc, code, language, access, editable }),
                credentials: 'include'
            }
        )
            .then(async response => {
                const res = await response.json();
                if (response.ok) return res
                return Promise.reject(res);
            })
            .then(response => {
                dispatch(messageActions.set({ type: 'success', message: 'Added Note Successfully !', description: JSON.stringify(response) }));
                setReloadNeeded(true);
            })
            .catch(err => {
                console.error(err);
                dispatch(messageActions.set({ type: 'error', message: 'Adding Note Unsuccessful!', description: JSON.stringify(err) }));
            })
    }

    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (openModal) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [openModal]);

    useEffect(() => {
        if (access === 'private') setEditable(false);
    }, [access]);

    return (
        <Dialog
            open={openModal}
            onClose={() => setOpenModal(false)}
            scroll='paper'
            aria-labelledby="Add-Note"
            fullWidth
            maxWidth={!isMobile && 'sm'}
            fullScreen={isMobile}
            TransitionComponent={SlideTransition}
        >
            <DialogTitle style={{ textTransform: 'capitalize' }}>Add Note</DialogTitle>
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
                    <TextField
                        required
                        id="title-textarea"
                        label="Title"
                        placeholder="Write max 20 characters"
                        value={title}
                        onChange={event => setTitle(event.target.value)}
                    />
                    <TextField
                        id="desc-textarea"
                        label="Description"
                        placeholder="Write max 200 characters"
                        multiline
                        value={desc}
                        onChange={event => setDesc(event.target.value)}
                    />
                    <FormControl sx={{ width: '85%' }}>
                        <InputLabel id="access-input-label">Access</InputLabel>
                        <Select
                            labelId="access-input-label"
                            id="access-input"
                            label="Access"
                            value={access}
                            onChange={event => setAccess(event.target.value)}
                        >
                            {isAdmin && <MenuItem value='global'>Global</MenuItem>}
                            <MenuItem value='public'>Public</MenuItem>
                            {!isGuest && <MenuItem value='private'>Private</MenuItem>}
                        </Select>
                    </FormControl>

                    {(access !== 'private') ?
                        <div>
                            <FormControlLabel
                                label="Editable (By Anyone)"
                                control={<CustomSwitch checked={editable} onChange={event => setEditable(event.target.checked)} />}
                                labelPlacement='start'
                            />
                            <span style={{ marginLeft: '0.9rem', fontWeight: 600, opacity: 0.6 }}>{editable ? "Yes" : "No"} </span>
                        </div>
                        :
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.6, margin: '0.6rem 0 0.6rem 0' }}>
                            Private Note can't be made Editable by everyone (as only you can view/edit)
                        </div>
                    }

                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: 600, fontSize: '1.1rem', opacity: 0.7 }}>Enter Code : </div>
                        <FormControl>
                            <InputLabel id="changeLang-select-label">Language</InputLabel>
                            <Select
                                labelId="changeLang-select-label"
                                id="changeLang-select"
                                value={language}
                                label="Language"
                                style={{ width: '8em', height: '2.5em' }}
                                onChange={e => setLanguage(e.target.value)}
                            >
                                <MenuItem value={'c'}>C</MenuItem>
                                <MenuItem value={'cpp'}>Cpp</MenuItem>
                                <MenuItem value={'py'}>Python</MenuItem>
                                <MenuItem value={'java'}>JAVA</MenuItem>
                                <MenuItem value={'js'}>JS</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <CodeEditorv3
                        code={code}
                        setCode={setCode}
                        language={language}
                        fontSize={13}
                    />
                </Box>

            </DialogContent>
            <DialogActions>
                <Button style={{ textTransform: 'capitalize' }} variant='outlined' color='secondary' onClick={handleAdd}>Add</Button>
                <Button style={{ textTransform: 'capitalize' }} variant='outlined' onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog >
    );
}

const CustomSwitch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
        borderRadius: 22 / 2,
        '&:before, &:after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
        },
        '&:before': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
            )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
            left: 12,
        },
        '&:after': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
            )}" d="M19,13H5V11H19V13Z" /></svg>')`,
            right: 12,
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        width: 16,
        height: 16,
        margin: 2,
    },
}));

export default AddNote;
