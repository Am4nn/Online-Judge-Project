import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import classes from './Customform.module.css'
import useInput from '../../hooks/use-input'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { changePassword, login, register } from '../../store/Auth/auth-actions'
import { authActions } from '../../store/Auth/auth-slice'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Tooltip, Zoom } from '@mui/material'
import { useMediaQuery } from '@mui/material'

import { LOGIN, REGISTER, CHANGEPASSWORD } from '../../App';

const Customform = props => {

    const { pageType } = props; // login, register

    const isMobile = useMediaQuery('(max-width:1000px)');
    const tooltipPlacement = 'right';

    const dispatch = useDispatch();
    const navigator = useNavigate();
    const loginState = useSelector(state => state.auth);

    if (loginState.loggedIn) {
        // this block never runs, as /login and /register routes get disabled
        dispatch(authActions.setError({ error: undefined }));
        navigator('/questions');
    }

    useEffect(() => {
        return () => dispatch(authActions.setError({ error: undefined }));
    }, [dispatch, pageType]);

    const {
        value: name,
        isValid: isNameValid,
        hasError: hasNameError,
        valueChangeHandler: nameChangeHandler,
        inputBlurHandler: nameBlurHandler,
        reset: resetName
    } = useInput(value => (value.trim() !== '' && value.length < 10));
    const nameErrorMsg = 'Name is necessary and should be less than 10 characters';

    const {
        value: username,
        isValid: isUserameValid,
        hasError: hasUsernameError,
        valueChangeHandler: usernameChangeHandler,
        inputBlurHandler: usernameBlurHandler,
        reset: resetUsername
    } = useInput(value => (value.trim() !== '' && value.length >= 4 && value.length < 10));
    const usernameErrorMsg = 'Username is necessary and should be Unique and less than 10 characters and greater than or equal to 4 characters';

    const {
        value: email,
        isValid: isEmailValid,
        hasError: hasEmailError,
        valueChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
        reset: resetEmail
    } = useInput(value => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)));
    const emailErrorMsg = 'Email is necessary and should be an valid Email and Unique';

    const {
        value: password,
        isValid: isPassValid,
        hasError: hasPassError,
        valueChangeHandler: passChangeHandler,
        inputBlurHandler: passBlurHandler,
        reset: resetPass
    } = useInput(value => (value.length >= 6));
    const passErrorMsg = 'Password is necessary and should be greater than or equal to 6 characters';

    const {
        value: oldPassword,
        isValid: isOldPassValid,
        hasError: hasOldPassError,
        valueChangeHandler: oldPassChangeHandler,
        inputBlurHandler: oldPassBlurHandler,
        reset: resetOldPass
    } = useInput(value => (value.length >= 6));
    const oldPassErrorMsg = 'Password is necessary and should be greater than or equal to 6 characters';

    const {
        value: passwordVer,
        isValid: isPassVerValid,
        hasError: hasPassVerError,
        valueChangeHandler: passVerChangeHandler,
        inputBlurHandler: passVerBlurHandler,
        reset: resetPassVer
    } = useInput(value => (value.length >= 6 && value === password));
    const passVerErrorMsg = 'Verify Password is necessary and should be same as Password';

    // username, email
    const [emailUnameSelection, setEUSelection] = useState('username');

    useEffect(() => {
        resetName();
        resetUsername();
        resetEmail();
        resetPass();
        resetPassVer();
        resetOldPass();
    }, [pageType, resetName, resetUsername, resetEmail, resetPass, resetPassVer, resetOldPass]);

    // final validations for form
    const isRegisterFormValid = isNameValid && isUserameValid &&
        isEmailValid && isPassValid && isPassVerValid;
    const isLoginFormValid = isPassValid && (
        emailUnameSelection === 'username' ? isUserameValid : isEmailValid
    );
    const isChangePassFormValid = isUserameValid && isEmailValid && isOldPassValid
        && isPassValid && isPassVerValid;

    let isFormValid;
    switch (pageType) {
        case REGISTER: isFormValid = isRegisterFormValid; break;
        case LOGIN: isFormValid = isLoginFormValid; break;
        case CHANGEPASSWORD: isFormValid = isChangePassFormValid; break;
        default: break;
    }

    // fix fogin with  email and username
    const loginHandler = () => {
        emailUnameSelection === 'username' && dispatch(login(username, undefined, password));
        emailUnameSelection === 'email' && dispatch(login(undefined, email, password));
    }
    const registerHandler = () => dispatch(register(name, username, email, password, passwordVer));
    const changePassHandler = () => dispatch(changePassword(username, email, oldPassword, password));

    const formSubmitHandler = event => {
        event.preventDefault();

        if (!isFormValid) return;
        switch (pageType) {
            case REGISTER: isFormValid = registerHandler(); break;
            case LOGIN: isFormValid = loginHandler(); break;
            case CHANGEPASSWORD: isFormValid = changePassHandler(); break;
            default: break;
        }

        resetPass();
        resetPassVer();
        resetOldPass();
    }

    return (
        <Fragment>
            <div className={classes.bgImg} />
            <div className={classes["Auth-form-container"]}>
                <form className={classes["Auth-form"]} onSubmit={formSubmitHandler}>
                    <div className={classes["Auth-form-content"]}>
                        <h3 className={classes["Auth-form-title"]}>
                            {(pageType === LOGIN && 'Sign In') || (pageType === REGISTER && 'Sign Up') || (pageType === CHANGEPASSWORD && "Change Password")}
                        </h3>

                        {(pageType === LOGIN || pageType === REGISTER) &&
                            <div className="text-center">
                                {(pageType === LOGIN && "Don't have an account? ") || (pageType === REGISTER && 'Already have an account ')}

                                <Link to={(pageType === LOGIN && '/register') || (pageType === REGISTER && '/login')} className="link-primary">
                                    {(pageType === LOGIN && 'Sign Up') || (pageType === REGISTER && 'Sign In')}
                                </Link>
                            </div>
                        }

                        {pageType === REGISTER &&
                            <div className='form-group mt-4'>
                                <Tooltip
                                    arrow
                                    placement={tooltipPlacement}
                                    TransitionComponent={Zoom}
                                    title={nameErrorMsg}
                                    open={!isMobile && hasNameError}
                                >
                                    <TextField
                                        id='name'
                                        type='text'
                                        label="Name"
                                        variant="filled"
                                        placeholder='Less than 10 characters'
                                        onChange={nameChangeHandler}
                                        onBlur={nameBlurHandler}
                                        value={name}
                                        sx={hasNameError ? {
                                            backgroundColor: '#fddddd',
                                        } : {}}
                                    />
                                </Tooltip>
                                {isMobile && hasNameError &&
                                    <div className={classes.validError}>
                                        {nameErrorMsg}
                                    </div>
                                }
                            </div>
                        }

                        {pageType === LOGIN &&
                            <FormControl sx={{
                                borderTop: '2px solid rgb(0,0,0,0.08)',
                                borderBottom: '2px solid rgb(0,0,0,0.08)',
                                marginTop: '0.5rem',
                                padding: '0 0.7rem'
                            }}>
                                <FormLabel id="login-mode">Choose with what you want to login</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="login-mode"
                                    name="login-mode"
                                    value={emailUnameSelection}
                                    onChange={event => setEUSelection(event.target.value)}
                                >
                                    <FormControlLabel
                                        value="username"
                                        control={<Radio />}
                                        label="Username"
                                    />
                                    <FormControlLabel
                                        value="email"
                                        control={<Radio />}
                                        label="Email"
                                    />
                                </RadioGroup>
                            </FormControl>
                        }


                        {(pageType === REGISTER || pageType === CHANGEPASSWORD || emailUnameSelection === 'username') &&
                            <div className='form-group mt-4'>
                                <Tooltip
                                    arrow
                                    placement={tooltipPlacement}
                                    TransitionComponent={Zoom}
                                    title={usernameErrorMsg}
                                    open={!isMobile && hasUsernameError}
                                >
                                    <TextField
                                        id='username'
                                        type='text'
                                        label="Username"
                                        variant="filled"
                                        placeholder='4 <= username < 10'
                                        onChange={usernameChangeHandler}
                                        onBlur={usernameBlurHandler}
                                        value={username}
                                        sx={hasUsernameError ? {
                                            backgroundColor: '#fddddd',
                                        } : {}}
                                    />
                                </Tooltip>
                                {isMobile && hasUsernameError &&
                                    <div className={classes.validError}>
                                        {usernameErrorMsg}
                                    </div>
                                }
                            </div>
                        }

                        {(pageType === REGISTER || pageType === CHANGEPASSWORD || emailUnameSelection === 'email') &&
                            <div className='form-group mt-4'>
                                <Tooltip
                                    arrow
                                    placement={tooltipPlacement}
                                    TransitionComponent={Zoom}
                                    title={emailErrorMsg}
                                    open={!isMobile && hasEmailError}
                                >
                                    <TextField
                                        id='email'
                                        type='email'
                                        label="Email"
                                        placeholder='Enter valid Email'
                                        variant="filled"
                                        onBlur={emailBlurHandler}
                                        onChange={emailChangeHandler}
                                        value={email}
                                        sx={hasEmailError ? {
                                            backgroundColor: '#fddddd',
                                        } : {}}
                                    />
                                </Tooltip>
                                {isMobile && hasEmailError &&
                                    <div className={classes.validError}>
                                        {emailErrorMsg}
                                    </div>
                                }
                            </div>
                        }

                        {pageType === CHANGEPASSWORD &&
                            <div className='form-group mt-3'>
                                <Tooltip
                                    arrow
                                    placement={tooltipPlacement}
                                    TransitionComponent={Zoom}
                                    title={oldPassErrorMsg}
                                    open={!isMobile && hasOldPassError}
                                >
                                    <TextField
                                        id='oldPassword'
                                        type='password'
                                        label="Old Password"
                                        placeholder='Minimum Length 6'
                                        variant="filled"
                                        onBlur={oldPassBlurHandler}
                                        onChange={oldPassChangeHandler}
                                        value={oldPassword}
                                        sx={hasOldPassError ? {
                                            backgroundColor: '#fddddd',
                                        } : {}}
                                    />
                                </Tooltip>
                                {isMobile && hasOldPassError &&
                                    <div className={classes.validError}>
                                        {oldPassErrorMsg}
                                    </div>
                                }
                            </div>
                        }

                        <div className='form-group mt-3'>
                            <Tooltip
                                arrow
                                placement={tooltipPlacement}
                                TransitionComponent={Zoom}
                                title={passErrorMsg}
                                open={!isMobile && hasPassError}
                            >
                                <TextField
                                    id='password'
                                    type='password'
                                    label={`${pageType === CHANGEPASSWORD ? 'New ' : ''}Password`}
                                    placeholder='Minimum Length 6'
                                    variant="filled"
                                    onBlur={passBlurHandler}
                                    onChange={passChangeHandler}
                                    value={password}
                                    sx={hasPassError ? {
                                        backgroundColor: '#fddddd',
                                    } : {}}
                                />
                            </Tooltip>
                            {isMobile && hasPassError &&
                                <div className={classes.validError}>
                                    {passErrorMsg}
                                </div>
                            }
                        </div>

                        {(pageType === REGISTER || pageType === CHANGEPASSWORD) &&
                            <div className='form-group mt-3'>
                                <Tooltip
                                    arrow
                                    placement={tooltipPlacement}
                                    TransitionComponent={Zoom}
                                    title={passVerErrorMsg}
                                    open={!isMobile && hasPassVerError}
                                >
                                    <TextField
                                        id='passwordVerify'
                                        type='password'
                                        label={`Re-Enter ${pageType === CHANGEPASSWORD ? 'New ' : ''}Password`}
                                        placeholder={`Same as ${pageType === CHANGEPASSWORD ? 'New ' : ''}Password`}
                                        variant="filled"
                                        onBlur={passVerBlurHandler}
                                        onChange={passVerChangeHandler}
                                        value={passwordVer}
                                        sx={hasPassVerError ? {
                                            backgroundColor: '#fddddd',
                                        } : {}}
                                    />
                                </Tooltip>
                                {isMobile && hasPassVerError &&
                                    <div className={classes.validError}>
                                        {passVerErrorMsg}
                                    </div>
                                }
                            </div>
                        }

                        <div className="d-grid gap-2 mt-4 mb-3">
                            <Button
                                type='submit'
                                color='info'
                                variant="contained"
                                disabled={!isFormValid || loginState.isLoading}
                                style={{
                                    textTransform: 'capitalize',
                                    letterSpacing: '0.15rem',
                                    fontSize: '1rem'
                                }}
                            >
                                {pageType}
                                {loginState && (loginState.isLoading || loginState.loggedIn) && <div className='spin' />}
                            </Button>
                        </div>


                        {loginState && loginState.error && (
                            <div className={classes.errormsg}>
                                {loginState.error}
                            </div>
                        )}

                        <div className='text-muted'>
                            Email/Username must be valid/Unique and Password length must be greater than or equal to 6 to submit.
                        </div>
                    </div>
                </form >
            </div >
        </Fragment>
    )
}

export default Customform;