import React, { Fragment } from 'react';
import classes from './Note.module.css';

const Note = ({ note, setOpenViewModal, setViewNote, refreshNotesList }) => {

    let { title, codeid, desc, username, access, editable, edited, deleted } = note;
    title = title || "Title";
    codeid = codeid || null;
    desc = desc || "Description";
    editable = editable || false;
    username = username || "guest";

    const noteClickHandler = () => {
        if ((!codeid || edited || deleted)) return;
        setViewNote(note);
        setOpenViewModal(true);
    }

    return (
        <div className={classes.note} style={(edited || deleted) && { cursor: 'default' }} onClick={noteClickHandler}>
            {(edited || deleted) ?
                <Fragment>
                    <div style={{ fontSize: '2.4rem', fontWeight: 700, color: 'hsl(0, 60%, 50%)' }}>{deleted ? "Deleted" : "Edited"}</div>
                    <div style={{ fontSize: '0.8rem', color: 'hsla(0, 40%, 50%,0.8)', margin: 'unset', lineHeight: '0.9rem' }}>{deleted ? "This note has been Removed !" : "An Edit has been made to this note"}</div>
                    <div style={{ fontSize: '0.8rem', color: 'hsla(0, 40%, 50%,0.8)', margin: 'unset', lineHeight: '0.9rem' }}>
                        <span style={{
                            zIndex: 100, position: 'relative',
                            color: 'blue', textDecoration: 'underline',
                            fontWeight: 500, cursor: 'pointer', marginRight: '3px'
                        }}
                            onClick={refreshNotesList} >
                            Refresh
                        </span>
                        this page to see changes !
                    </div>
                </Fragment>
                :
                < Fragment >
                    <h4 className={classes.title}>{title}</h4>
                    <p className={classes.desc}>{desc}</p>
                </Fragment>
            }
            <div className={classes.ftr}>
                <span>{username}</span>
                <span>{access} / {editable ? "editable" : "read-only"}</span>
            </div>
        </div >
    )
}

export default Note;