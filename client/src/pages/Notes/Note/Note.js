import React from 'react';
import classes from './Note.module.css';

const Note = ({ note, setOpenViewModal, setViewNote, setEditNote }) => {

    let { title, codeid, desc, username, access, editable } = note;
    title = title || "Title";
    codeid = codeid || null;
    desc = desc || "Description";
    editable = editable || false;
    username = username || "guest";

    const noteClickHandler = () => {
        if (!codeid) return;
        setViewNote(note);
        setOpenViewModal(true);
    }

    return (
        <div className={classes.note} onClick={noteClickHandler}>
            <h4 className={classes.title}>{title}</h4>
            <p>{desc}</p>
            <div className={classes.ftr}>
                <span>{username}</span>
                <span>{access} / {editable ? "editable" : "read-only"}</span>
            </div>
        </div>
    )
}

export default Note;