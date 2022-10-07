import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from "react-redux"

import {
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
} from '@mui/material';

import {
    Login,
    Logout,
    PersonAdd,
    LockOpen
} from '@mui/icons-material';

import Nav from "react-bootstrap/Nav"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

import { logout } from "../../../store/Auth/auth-actions"

const AccountMenu = ({ setExpand }) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigator = useNavigate();

    const loginState = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }

    const loginHandler = () => {
        setExpand(false);
        navigator('/login')
    }
    const registerHandler = () => {
        setExpand(false);
        navigator('/register')
    }
    const logoutHandler = event => {
        event.stopPropagation();
        if (loginState.isLoading) return;
        dispatch(logout());
    }
    const accountHandler = () => {
        setExpand(false);
        navigator('/account')
    }
    const dashboardHandler = () => {
        setExpand(false);
        navigator('/dashboard')
    }
    const changePassHandler = () => {
        setExpand(false);
        navigator('/changePassword')
    }

    return (
        <Fragment>
            <Nav.Link
                className='myNavLink'
                onClick={handleClick}
            >
                Account
                <span className="dropdown-caret"></span>
            </Nav.Link>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
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
                {loginState.loggedIn === true &&
                    <MenuItem onClick={accountHandler}>
                        <Avatar /> {loginState.username}
                    </MenuItem>
                }
                {loginState.loggedIn === true &&
                    <MenuItem onClick={dashboardHandler}>
                        <FontAwesomeIcon icon={faUserSecret}
                            style={{
                                backgroundColor: 'rgb(0,0,0,0.1)',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                padding: '6px',
                                marginLeft: '-4px',
                                marginRight: '8px'
                            }}
                        />
                        <span>Dashboard</span>
                    </MenuItem>
                }
                {loginState.loggedIn === true &&
                    <Divider />
                }
                {loginState.loggedIn === false &&
                    <MenuItem onClick={registerHandler}>
                        <ListItemIcon>
                            <PersonAdd fontSize="small" />
                        </ListItemIcon>
                        Register
                    </MenuItem>
                }
                {loginState.loggedIn === false &&
                    <MenuItem onClick={loginHandler}>
                        <ListItemIcon>
                            <Login fontSize="small" />
                        </ListItemIcon>
                        Login
                    </MenuItem>
                }
                <MenuItem onClick={changePassHandler}>
                    <ListItemIcon>
                        <LockOpen fontSize="small" />
                    </ListItemIcon>
                    Change Password
                </MenuItem>
                {loginState.loggedIn === true &&
                    <MenuItem onClick={logoutHandler}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        {loginState.isLoading ?
                            <Fragment>
                                Logging Out
                                <div className='spin' color='black' />
                            </Fragment>
                            : 'Logout'
                        }
                    </MenuItem>
                }
            </Menu>
        </Fragment>
    );
}

export default AccountMenu;