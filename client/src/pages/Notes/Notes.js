import React, { forwardRef, Fragment, useEffect, useState } from 'react'
import Note from './Note/Note';
import classes from './Notes.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { Fab, Slide, Tooltip, Zoom } from '@mui/material';
import { NoteAdd } from '@mui/icons-material'
import AddNote from './AddNote/AddNote';
import ViewNote from './ViewNote/ViewNote';
import EditNote from './EditNote/EditNote';
import { useMediaQuery } from '@mui/material'
import { SERVER_LINK } from '../../dev-server-link';
import LoadingSpinner from '../../compenents/LoadingSpinner/LoadingSpinner';
import { useSearchParams } from 'react-router-dom';
import { messageActions } from '../../store/Message/message-slice';

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

const SlideTransition = forwardRef((props, ref) => (
    <Slide ref={ref} {...props} direction="up" />
));

let isFirstRender = true;

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
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (!isFirstRender || loading) return;
        isFirstRender = false;
        const querynoteid = searchParams.get("view");
        if (!querynoteid) return;
        const foundNote = allNotes.find(ele => ele._id === querynoteid);
        if (!foundNote) {
            dispatch(messageActions.set({
                type: 'error',
                message: "The Note's Link you are accessing does not exists",
                description: 'There is a query string in url, which does not belong to any note, this may be due to : the note you are tying to access has been deleted or may be link in incomplete !'
            }));
            return;
        }

        setOpenViewModal(true);
        setViewNote(foundNote);
    }, [loading, searchParams, allNotes, dispatch]);

    useEffect(() => {
        if (isFirstRender) return;
        if (openViewModal) setSearchParams({ "view": viewNote._id });
        else setSearchParams({});
    }, [openViewModal, setSearchParams, viewNote]);


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
        dispatch(messageActions.set({
            type: 'info',
            message: 'Click on Notes to view their Code !',
            description: 'If you click on a Note, you will be able to share, edit, or delete it. Alternatively, you can add a new note by clicking on the Add button !'
        }));
    }, [dispatch]);

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
                    <AddNote setSearchParams={setSearchParams} SlideTransition={SlideTransition} setReloadNeeded={setReloadNeeded} isMobile={isMobile} openModal={openAddModal} setOpenModal={setOpenAddModal} />
                    <ViewNote setSearchParams={setSearchParams} SlideTransition={SlideTransition} setReloadNeeded={setReloadNeeded} markEditOrDelete={markEditOrDelete} isMobile={isMobile} openModal={openViewModal} setOpenModal={setOpenViewModal} setEditNote={setEditNote} setOpenEditModal={setOpenEditModal} viewNote={viewNote} />
                    <EditNote setSearchParams={setSearchParams} SlideTransition={SlideTransition} setReloadNeeded={setReloadNeeded} markEditOrDelete={markEditOrDelete} isMobile={isMobile} openModal={openEditModal} setOpenModal={setOpenEditModal} editNote={editNote} />

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