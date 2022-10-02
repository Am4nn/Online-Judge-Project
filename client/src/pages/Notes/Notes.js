import React, { useEffect, useState } from 'react'
import Note from './Note/Note';
import classes from './Notes.module.css';
import { useSelector } from 'react-redux';
import { Fab } from '@mui/material';
import { NoteAdd } from '@mui/icons-material'
import AddNote from './AddNote/AddNote';
import ViewNote from './ViewNote/ViewNote';
import EditNote from './EditNote/EditNote';

// notesData is just for dev purpose
const notesData = [
    {
        _id: '1',
        title: 'FCFS Code OS',
        desc: 'This code is written by me for OS assignment on FCFS',
        codeid: '1dfg58-a153sd-asd4as-48asd',
        username: 'username1',
        access: 'global',
        editable: false,
        language: 'c'
    }, {
        _id: '2',
        title: 'SJF Code OS',
        desc: 'This code is written by me for OS assignment on SJF',
        codeid: '1dfg58-a153sd-asd4as-48ase',
        username: 'username2',
        access: 'public',
        editable: true,
        language: 'java'
    }, {
        _id: '3',
        title: 'SRTF Code OS',
        desc: 'This code is written by me for OS assignment on SRTF',
        codeid: '1dfg58-a153sd-asd4as-48asf',
        username: 'username3',
        access: 'public',
        editable: false,
        language: 'cpp'
    }, {
        _id: '4',
        title: 'Round Robin Code OS',
        desc: 'This code is written by me for OS assignment on Round Robin',
        codeid: '1dfg58-a153sd-asd4as-48asg',
        username: 'username4',
        access: 'private',
        language: 'python'
    }, {
        _id: '5',
        title: 'Priority First Code OS',
        desc: 'This code is written by me for OS assignment on Priority First',
        codeid: '1dfg58-a153sd-asd4as-48ash',
        username: 'username5',
        access: 'global',
        editable: true,
        language: 'js'
    }, {
        _id: '6',
        title: 'Fork Code OS',
        desc: 'This code is written by me for OS assignment on Fork This code is written by me for OS assignment on Fork ',
        codeid: '1dfg58-a153sd-asd4as-48asi',
        username: 'username6',
        access: 'private',
        editable: false,
        language: 'cpp'
    }, {
        _id: '7',
        title: 'Fork Code OS',
        desc: 'This code is written by me for OS assignment on Fork This code is written by me for OS assignment on Fork ',
        codeid: '1dfg58-a153sd-asd4as-48asi',
        username: 'username6',
        access: 'global',
        editable: false,
        language: 'cpp'
    }, {
        _id: '8',
        title: 'Fork Code OS',
        desc: 'This code is written by me for OS assignment on Fork This code is written by me for OS assignment on Fork ',
        codeid: '1dfg58-a153sd-asd4as-48asi',
        username: 'username6',
        access: 'global',
        editable: false,
        language: 'cpp'
    }, {
        _id: '9',
        title: 'Fork Code OS',
        desc: 'This code is written by me for OS assignment on Fork This code is written by me for OS assignment on Fork ',
        codeid: '1dfg58-a153sd-asd4as-48asi',
        username: 'username6',
        access: 'global',
        editable: false,
        language: 'cpp'
    }, {
        _id: '10',
        title: 'Fork Code OS',
        desc: 'This code is written by me for OS assignment on Fork This code is written by me for OS assignment on Fork ',
        codeid: '1dfg58-a153sd-asd4as-48asi',
        username: 'username6',
        access: 'global',
        editable: false,
        language: 'cpp'
    }, {
        _id: '11',
        title: 'Fork Code OS',
        desc: 'This code is written by me for OS assignment on Fork This code is written by me for OS assignment on Fork ',
        codeid: '1dfg58-a153sd-asd4as-48asi',
        username: 'username6',
        access: 'global',
        editable: false,
        language: 'cpp'
    }, {
        _id: '12',
        title: 'Fork Code OS',
        desc: 'This code is written by me for OS assignment on Fork This code is written by me for OS assignment on Fork ',
        codeid: '1dfg58-a153sd-asd4as-48asi',
        username: 'username6',
        access: 'public',
        editable: true,
        language: 'cpp'
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

    const [openAddModal, setOpenAddModal] = useState(false);

    const [openViewModal, setOpenViewModal] = useState(false);
    const [viewNote, setViewNote] = useState({});

    const [openEditModal, setOpenEditModal] = useState(false);
    const [editNote, setEditNote] = useState({});


    const { loggedIn, username } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchNotesFromServer = () => {
            /*
                Make a request to server, with credentials and it will return an array 
                containing all global and public notes but also with private notes specific
                to that credentials.
            */
            setAllNotes(notesData);
        }

        fetchNotesFromServer();
    }, []);

    const addNoteHandler = () => setOpenAddModal(true);

    return (
        <div className={classes.container}>
            <AddNote openModal={openAddModal} setOpenModal={setOpenAddModal} />
            <ViewNote openModal={openViewModal} setOpenModal={setOpenViewModal} setEditNote={setEditNote} setOpenEditModal={setOpenEditModal} viewNote={viewNote} />
            <EditNote openModal={openEditModal} setOpenModal={setOpenEditModal} editNote={editNote} />
            <div className={classes.head}>
                Notes
                <Fab onClick={addNoteHandler} variant='extended' className={classes.addNoteFab} aria-label='add-note'>
                    <NoteAdd fontSize='medium' sx={{ mr: 1 }} />
                    Add Note
                </Fab>
            </div>

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
        </div>
    )
}

export default Notes;