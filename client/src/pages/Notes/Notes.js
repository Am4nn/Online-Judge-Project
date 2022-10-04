import React, { Fragment, useEffect, useState } from 'react'
import Note from './Note/Note';
import classes from './Notes.module.css';
import { useSelector } from 'react-redux';
import { Fab, Tooltip, Zoom } from '@mui/material';
import { NoteAdd } from '@mui/icons-material'
import AddNote from './AddNote/AddNote';
import ViewNote from './ViewNote/ViewNote';
import EditNote from './EditNote/EditNote';
import { useMediaQuery } from '@mui/material'
import { SERVER_LINK } from '../../dev-server-link';
import LoadingSpinner from '../../compenents/LoadingSpinner/LoadingSpinner';

// notesData is just for dev purpose
const notesData = [
    {
        _id: '1',
        title: 'FCFS Code OS',
        desc: 'This code is written by me for OS assignment on FCFS',
        codeid: '1dfg58-a153sd-asd4as-48asd',
        username: 'aman',
        access: 'global',
        editable: false
    }, {
        _id: '2',
        title: 'SJF Code OS',
        desc: 'This code is written by me for OS assignment on SJF',
        codeid: '1dfg58-a153sd-asd4as-48ase',
        username: 'username2',
        access: 'public',
        editable: true
    }, {
        _id: '3',
        title: 'SRTF Code OS',
        desc: 'This code is written by me for OS assignment on SRTF',
        codeid: '1dfg58-a153sd-asd4as-48asf',
        username: 'username3',
        access: 'public',
        editable: false
    }, {
        _id: '4',
        title: 'Round Robin Code OS',
        desc: 'This code is written by me for OS assignment on Round Robin',
        codeid: '1dfg58-a153sd-asd4as-48asg',
        username: 'username4',
        access: 'private'
    }, {
        _id: '5',
        title: 'Priority First Code OS',
        desc: 'This code is written by me for OS assignment on Priority First',
        codeid: '1dfg58-a153sd-asd4as-48ash',
        username: 'aman',
        access: 'global',
        editable: true
    }, {
        _id: '6',
        title: 'Fork Code OS',
        desc: 'This code is written by me for OS assignment on Fork This code is written by me for OS assignment on Fork ',
        codeid: '1dfg58-a153sd-asd4as-48asi',
        username: 'username6',
        access: 'private',
        editable: false
    }, {
        _id: '7',
        title: 'Fork Code OS',
        desc: 'This code is written by me for OS assignment on Fork This code is written by me for OS assignment on Fork ',
        codeid: '1dfg58-a153sd-asd4as-48asi',
        username: 'aman',
        access: 'global',
        editable: false
    }, {
        _id: '8',
        title: 'Fork Code OS',
        desc: 'This code is written by me for OS assignment on Fork This code is written by me for OS assignment on Fork ',
        codeid: '1dfg58-a153sd-asd4as-48asi',
        username: 'aman',
        access: 'global',
        editable: false
    }, {
        _id: '9',
        title: 'Fork Code OS',
        desc: 'This code is written by me for OS assignment on Fork This code is written by me for OS assignment on Fork ',
        codeid: '1dfg58-a153sd-asd4as-48asi',
        username: 'aman',
        access: 'global',
        editable: false
    }, {
        _id: '10',
        title: 'Fork Code OS',
        desc: 'This code is written by me for OS assignment on Fork This code is written by me for OS assignment on Fork ',
        codeid: '1dfg58-a153sd-asd4as-48asi',
        username: 'aman',
        access: 'global',
        editable: false
    }, {
        _id: '11',
        title: 'Fork Code OS',
        desc: 'This code is written by me for OS assignment on Fork This code is written by me for OS assignment on Fork ',
        codeid: '1dfg58-a153sd-asd4as-48asi',
        username: 'aman',
        access: 'global',
        editable: false
    }, {
        _id: '12',
        title: 'Fork Code OS',
        desc: 'This code is written by me for OS assignment on Fork This code is written by me for OS assignment on Fork ',
        codeid: '1dfg58-a153sd-asd4as-48asi',
        username: 'username6',
        access: 'public',
        editable: true
    },
];

/*
    Schema : _id, title, desc, codeid, username, access, editable, language
    
    title: Max 18 characters

    codeid: It represent database _id for codes (if any)

    language: c, cpp, js, java, python

    access : global, public, private
        global : It is submitted by admin and 
                 is shown on top and can/can't (depends on editable) be modified by anyone else than admin, 
                 and can be viewed by anyone.
        public : It is submitted by any user/guest and
                 is editable by anyone/none(depends on user to allow edit or not)
                 and can be viewed by anyone.
        private: It is submitted by loggedIn user and
                 can only read/edited by that perticular user only.

    editable: true/false
        It represents if a public/global note is editable by any user/guest.
        It won't matter if note is private (hence, there is no field like editable in private note).

    *   Notes are only deletable by user that created the note and 
        if note is created by guest then anyone one can delete it
        and admin can delete any note.
*/

const Notes = () => {

    const [allNotes, setAllNotes] = useState([]);

    const [reloadNeeded, setReloadNeeded] = useState(false);

    const [openAddModal, setOpenAddModal] = useState(false);

    const [openViewModal, setOpenViewModal] = useState(false);
    const [viewNote, setViewNote] = useState({});

    const [openEditModal, setOpenEditModal] = useState(false);
    const [editNote, setEditNote] = useState({});


    const isMobile = useMediaQuery('(max-width:620px)');
    const { loggedIn, username } = useSelector(state => state.auth);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);

    const markEditOrDelete = (_id, property) => {
        setAllNotes(prev => {
            const newNotes = prev.map(ele => {
                if (ele._id === _id) {
                    const newEle = { ...ele };
                    newEle[property] = true;
                    return newEle;
                }
                else return ele;
            });
            return newNotes;
        });
    }

    useEffect(() => {
        /*
        Make a request to server, with credentials and it will return an array 
        containing all global and public notes but also with private notes specific
        to that credentials.
        */

        const fetchNotesFromServer = () => {
            fetch(
                `${SERVER_LINK}/api/notes/allNotes`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'GET',
                    credentials: 'include'
                }
            )
                .then(response => {
                    if (response.ok) return response.json();
                    return Promise.reject(response);
                })
                .then(response => setAllNotes(response))
                .catch(setError)
                .finally(() => setLoading(false))
        }

        fetchNotesFromServer();
    }, []);

    const addNoteHandler = () => setOpenAddModal(true);

    return (
        // show loading while notes are being fetched !
        <Fragment>
            {loading && <LoadingSpinner />}
            {!loading && error && (
                <div>
                    <div className='errorTemplate'>
                        <div><span>Msg : </span>Wasn't able to connect to server check if your are not offline or server might not be working !</div>
                        {error && <div><span>Error : </span>{JSON.stringify(error)}</div>}
                    </div>
                </div>
            )}
            {!error && (
                <div className={classes.container}>
                    <AddNote setReloadNeeded={setReloadNeeded} isMobile={isMobile} openModal={openAddModal} setOpenModal={setOpenAddModal} />
                    <ViewNote setReloadNeeded={setReloadNeeded} markEditOrDelete={markEditOrDelete} isMobile={isMobile} openModal={openViewModal} setOpenModal={setOpenViewModal} setEditNote={setEditNote} setOpenEditModal={setOpenEditModal} viewNote={viewNote} />
                    <EditNote setReloadNeeded={setReloadNeeded} markEditOrDelete={markEditOrDelete} isMobile={isMobile} openModal={openEditModal} setOpenModal={setOpenEditModal} editNote={editNote} />

                    <Tooltip TransitionComponent={Zoom} title='Add Note' placement='bottom'>
                        <Fab onClick={addNoteHandler} className={classes.addNoteFab} aria-label='add-note'>
                            <NoteAdd sx={{ fontSize: '1.8rem' }} />
                        </Fab>
                    </Tooltip>

                    <div className={classes.head}>Notes</div>

                    {reloadNeeded &&
                        <div style={{
                            fontSize: '0.8rem', color: 'hsla(0, 40%, 50%,0.8)',
                            margin: 'unset',
                            position: 'absolute', top: '2.6rem'
                        }}><span onClick={(() => window.location.reload())} style={{
                            zIndex: 100, position: 'relative',
                            color: 'blue', textDecoration: 'underline',
                            fontWeight: 500, cursor: 'pointer'
                        }}>Refresh</span> this page to see changes !</div>
                    }

                    {!loading && (
                        <Fragment>
                            <div className={classes.ncLabel}><span>Global Notes by Admin</span></div>
                            <div className={classes.noteList}>
                                {allNotes.filter(note => (note.access === 'global')).map(note =>
                                    <Note key={note._id} note={note} setViewNote={setViewNote} setOpenViewModal={setOpenViewModal} />
                                )}
                            </div>

                            <div className={classes.ncLabel}><span>Public Notes by Users/Guest</span></div>
                            <div className={classes.noteList}>
                                {allNotes.filter(note => (note.access === 'public')).map(note =>
                                    <Note key={note._id} note={note} setViewNote={setViewNote} setOpenViewModal={setOpenViewModal} />
                                )}
                            </div>

                            <div className={classes.ncLabel}>
                                {loggedIn ?
                                    <span>Private Notes by {username}</span> :
                                    <span className={classes.red}>To see Private Notes you must be Logged In !</span>
                                }
                            </div>
                            {loggedIn ?
                                <div className={classes.noteList}>
                                    {allNotes.filter(note => (note.access === 'private')).length === 0 ?
                                        <span className={classes.red + ' ' + classes.noNote}>You have not created any Private Note, <button onClick={addNoteHandler}>Make One</button></span> :
                                        allNotes.filter(note => (note.access === 'private')).map(note =>
                                            <Note key={note._id} note={note} setViewNote={setViewNote} setOpenViewModal={setOpenViewModal} />
                                        )}
                                </div>
                                : ""
                            }
                        </Fragment>
                    )}
                </div>
            )
            }
        </Fragment >
    )
}

export default Notes;