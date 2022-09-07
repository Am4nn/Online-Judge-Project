import React, { Fragment, useState } from 'react';

import {
    Box,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
    IconButton,
    Tooltip,
    Zoom
} from '@mui/material';

import {
    Login,
    Logout,
    PersonAdd
} from '@mui/icons-material';
import { useNavigate } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

import classes from './AccountMenu.module.css';

const AccountMenu = ({ loginState, logoutHandler, setExpand, expand }) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigator = useNavigate();

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
    const logoutBtnHandler = event => {
        event.stopPropagation();
        logoutHandler();
    }
    const accountHandler = () => {
        setExpand(false);
        navigator('/account')
    }
    const dashboardHandler = () => {
        setExpand(false);
        navigator('/dashboard')
    }

    return (
        <React.Fragment>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: 'center',
                paddingRight: `${expand ? 3 : 0}rem`
            }}>
                <Tooltip TransitionComponent={Zoom} title="Account settings">
                    <div
                        className={classes.user}
                        onClick={handleClick}
                    >
                        <IconButton
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            {loginState.loggedIn === false ?
                                <Avatar sx={{ width: 32, height: 32 }}>
                                    <Login />
                                </Avatar> : <Avatar sx={{ width: 32, height: 32 }} />
                            }
                        </IconButton>
                        <span className={classes.username}>{loginState.loggedIn === true ? 'Aman Arya' : 'Sign-in/Sign-up'}</span>
                        <span className="dropdown-caret"></span>
                    </div>
                </Tooltip>
            </Box>
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
                    <MenuItem onClick={accountHandler}>
                        <Avatar /> My account
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
                {loginState.loggedIn === true &&
                    <MenuItem onClick={logoutBtnHandler}>
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
        </React.Fragment>
    );
}

export default AccountMenu;