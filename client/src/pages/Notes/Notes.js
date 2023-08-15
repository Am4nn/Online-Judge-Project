import React, { forwardRef, Fragment, useCallback, useEffect, useState, useTransition } from 'react'
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';
import { Fab, InputBase, Slide, Tooltip, Zoom, useMediaQuery } from '@mui/material';
import { Cancel, NoteAdd, Search, SupervisedUserCircle, KeyboardArrowRight } from '@mui/icons-material'

import AddNote from './AddNote/AddNote';
import ViewNote from './ViewNote/ViewNote';
import EditNote from './EditNote/EditNote';
import { SERVER_LINK } from '../../dev-server-link';
import { messageActions } from '../../store/Message/message-slice';
import LoadingSpinner from '../../compenents/LoadingSpinner/LoadingSpinner';
import Note from './Note/Note';
import classes from './Notes.module.css';
// import useDebounce from '../../hooks/useDebounce';
// import useTimeout from './../../hooks/useTimeout';

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
    const [originalAllNotes, setOriginalAllNotes] = useState([]);

    const [openAddModal, setOpenAddModal] = useState(false);

    const [openViewModal, setOpenViewModal] = useState(false);
    const [viewNote, setViewNote] = useState({});

    const [openEditModal, setOpenEditModal] = useState(false);
    const [editNote, setEditNote] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);
    const [reloadNeeded, setReloadNeeded] = useState(false);
    const [searchNoteQuery, setSearchNoteQuery] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [isAdminMode, setAdminMode] = useState(false);

    const dispatch = useDispatch();
    const { loggedIn, username, isAdmin } = useSelector(state => state.auth);
    const isMobile = useMediaQuery('(max-width:620px)');

    useEffect(() => {
        if (!isFirstRender || loading) return;
        isFirstRender = false;
        const querynoteid = searchParams.get("view");
        if (!querynoteid) return;
        const foundNote = originalAllNotes.find(ele => ele._id === querynoteid);
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
    }, [loading, searchParams, originalAllNotes, dispatch]);

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

    /*
    Make a request to server, with credentials and it will return an array 
    containing all global and public notes but also with private notes specific
    to that credentials.
    */
    const fetchNotesFromServer = useCallback(() => {
        setLoading(true);
        fetch(
            `${SERVER_LINK}/api/notes/allNotes${(isAdminMode) ? '?admin=true' : ''}`,
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
                if (response.ok) return res
                return Promise.reject(res);
            })
            .then(response => { setAllNotes(response); setOriginalAllNotes(response); })
            .catch(setError)
            .finally(() => setLoading(false))
    }, [isAdminMode]);

    useEffect(() => {
        fetchNotesFromServer();
    }, [dispatch, fetchNotesFromServer]);

    useEffect(() => {
        dispatch(messageActions.set({
            type: 'info',
            message: 'Click on Notes to view their Code !',
            description: 'If you click on a Note, you will be able to share, edit, or delete it. Alternatively, you can add a new note by clicking on the Add button !'
        }));
    }, [dispatch]);

    const addNoteHandler = () => setOpenAddModal(true);

    // const [isSearching] = useSearchNotes_Debounce({ searchNoteQuery, setAllNotes, originalAllNotes });
    const [isSearching] = useSearchNotes_Transition({ searchNoteQuery, setAllNotes, originalAllNotes });

    const refreshNotesList = () => {
        setEditNote({});
        setViewNote({});
        setReloadNeeded(false);
        fetchNotesFromServer();
    }

    return (
        <Fragment>
            {/* show loading while notes are being fetched ! */}
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

                    <Tools
                        addNoteHandler={addNoteHandler}
                        isAdmin={isAdmin}
                        isAdminMode={isAdminMode}
                        setAdminMode={setAdminMode}
                    />

                    <Heading
                        refreshNotesList={refreshNotesList}
                        reloadNeeded={reloadNeeded}
                    />

                    <SearchComponent
                        searchNoteQuery={searchNoteQuery}
                        setSearchNoteQuery={setSearchNoteQuery}
                        isSearching={isSearching}
                    />

                    {!loading && (
                        <NotesSection
                            allNotes={allNotes}
                            refreshNotesList={refreshNotesList}
                            setViewNote={setViewNote}
                            setOpenViewModal={setOpenViewModal}
                            loggedIn={loggedIn}
                            username={username}
                            addNoteHandler={addNoteHandler}
                        />
                    )}

                </div>
            )}
        </Fragment >
    )
};

const useSearchNotes_Transition = ({ searchNoteQuery, setAllNotes, originalAllNotes }) => {
    const [isSearching, startTransition] = useTransition();
    useEffect(() => {
        startTransition(() => {
            if (!searchNoteQuery) setAllNotes(originalAllNotes);
            else setAllNotes(originalAllNotes.filter(note => (
                note.title.toLowerCase().includes(searchNoteQuery.toLowerCase()) ||
                note.desc.toLowerCase().includes(searchNoteQuery.toLowerCase())
            )));
        });
    }, [searchNoteQuery, originalAllNotes, setAllNotes]);
    return [isSearching];
}

// const useSearchNotes_Debounce = ({ searchNoteQuery, setAllNotes, originalAllNotes }) => {
//     const [isSearching, setIsSearching] = useState(false);
//     const { reset, clear } = useTimeout(() => {

//         if (!searchNoteQuery) setAllNotes(originalAllNotes);
//         else setAllNotes(originalAllNotes.filter(note => (
//             note.title.toLowerCase().includes(searchNoteQuery.toLowerCase()) ||
//             note.desc.toLowerCase().includes(searchNoteQuery.toLowerCase())
//         )));

//         setIsSearching(false);
//     }, 500);
//     useEffect(() => {
//         setIsSearching(true);
//         reset();
//     }, [searchNoteQuery, reset]);
//     useEffect(() => {
//         setIsSearching(false);
//         clear();
//     }, [clear]);
//     return [isSearching];
// }

const Tools = ({ addNoteHandler, isAdmin, isAdminMode, setAdminMode }) => {
    const adminModeHandler = () => isAdmin ? setAdminMode(prev => !prev) : setAdminMode(false);
    return (
        <Fragment>
            <Tooltip TransitionComponent={Zoom} title='Add Note' placement='bottom'>
                <Fab onClick={addNoteHandler} className={classes.addNoteFab} aria-label='add-note'>
                    <NoteAdd sx={{ fontSize: '1.7rem' }} />
                </Fab>
            </Tooltip>

            {isAdmin &&
                <Tooltip TransitionComponent={Zoom} title='Admin Mode' placement='bottom'>
                    <Fab color='secondary' onClick={adminModeHandler} className={classes.adminModeFab} aria-label='admin-mode'>
                        {isAdminMode ?
                            <Cancel sx={{ fontSize: '2.4rem' }} /> :
                            <SupervisedUserCircle sx={{ fontSize: '2.4rem' }} />
                        }
                    </Fab>
                </Tooltip>
            }
        </Fragment>
    );
};

const Heading = ({ reloadNeeded, refreshNotesList }) => (
    <Fragment>
        <div className={classes.head}>Notes</div>
        {reloadNeeded &&
            <div style={{
                fontSize: '1rem', color: 'hsla(0, 40%, 50%,0.8)',
                margin: 'unset', position: 'relative', marginBottom: '0.5rem'
            }}><span onClick={refreshNotesList} style={{
                zIndex: 100, position: 'relative',
                color: 'blue', textDecoration: 'underline',
                fontWeight: 500, cursor: 'pointer'
            }}>Refresh</span> this page to see changes !</div>
        }
    </Fragment>
);

const SearchComponent = ({ searchNoteQuery, setSearchNoteQuery, isSearching }) => {
    return (
        <Box sx={{
            position: 'relative',
            borderRadius: '5px',
            backgroundColor: 'rgba(0,0,0,0.16)',
            transition: 'all 300ms ease-in-out',
            '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.13)',
            },
            width: '75%',
            display: 'flex',
            marginBottom: '1rem',
            marginTop: '0.5rem'
        }}>
            <Box sx={{
                padding: '0 1rem',
                height: '100%',
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Search />
            </Box>
            <InputBase sx={{
                color: 'inherit',
                width: '100%',
                '& .MuiInputBase-input': {
                    padding: '0.7rem',
                    paddingLeft: '3.5rem',
                    width: '100%'
                },
            }}
                placeholder="Search a note…"
                inputProps={{ 'aria-label': 'search a note' }}
                onChange={event => setSearchNoteQuery(event.target.value)}
                value={searchNoteQuery}
            />
            {isSearching && <span style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }} className='spin' color='black' />}
        </Box>
    );
}

const NotesSection = ({ allNotes, refreshNotesList, setViewNote, setOpenViewModal, loggedIn, username, addNoteHandler }) => {
    return (
        <Fragment>
            <div className={classes.ncLabel}><span>Global Notes by Admin</span><KeyboardArrowRight fontSize='medium' /></div>
            <div className={classes.noteList}>
                {allNotes.filter(note => (note.access === 'global')).map(note =>
                    <Note refreshNotesList={refreshNotesList} key={note._id} note={note} setViewNote={setViewNote} setOpenViewModal={setOpenViewModal} />
                )}
            </div>

            <div className={classes.ncLabel}><span>Public Notes by Users/Guest</span></div>
            <div className={classes.noteList}>
                {allNotes.filter(note => (note.access === 'public')).map(note =>
                    <Note refreshNotesList={refreshNotesList} key={note._id} note={note} setViewNote={setViewNote} setOpenViewModal={setOpenViewModal} />
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
                            <Note refreshNotesList={refreshNotesList} key={note._id} note={note} setViewNote={setViewNote} setOpenViewModal={setOpenViewModal} />
                        )}
                </div>
                : ""
            }
        </Fragment>
    );
}

export default Notes;