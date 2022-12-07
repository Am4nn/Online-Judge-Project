import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { messageActions } from '../../../store/Message/message-slice'

import {
    Menu,
    MenuItem,
} from '@mui/material';
import { Share, Note, Link, Description } from '@mui/icons-material';
import Nav from "react-bootstrap/Nav"
import { useNavigate } from 'react-router';

const ExtraMenu = ({ setExpand }) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }

    const notesHanlder = () => {
        navigate('/notes');
        setExpand(false);
    }
    const GSLHanlder = () => {
        dispatch(messageActions.set({
            type: 'warning',
            message: 'This feature is not available yet !'
        }));
        setExpand(false);
    }
    const LSHanlder = () => {
        navigate('/linkShortner');
        setExpand(false);
    }
    const serverLogsHandler = () => {
        navigate('/serverLogs');
        setExpand(false);
    }

    return (
        <Fragment>
            <Nav.Link
                className='myNavLink'
                onClick={handleClick}
            >
                Extra
                <span className="dropdown-caret"></span>
            </Nav.Link>
            <Menu
                id="extra-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem
                    onClick={notesHanlder}
                >
                    <Note style={{ marginRight: '8px' }} />
                    Notes
                </MenuItem>
                <MenuItem
                    onClick={GSLHanlder}
                >
                    <Share style={{ marginRight: '8px' }} />
                    Get Short Link</MenuItem>
                <MenuItem
                    onClick={LSHanlder}
                >
                    <Link style={{ marginRight: '8px' }} />
                    Link Shortner
                </MenuItem>
                <MenuItem
                    onClick={serverLogsHandler}
                >
                    <Description style={{ marginRight: '8px' }} />
                    Server Logs
                </MenuItem>
            </Menu>
        </Fragment>
    );
}

export default ExtraMenu;