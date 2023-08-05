import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import classes from './Customform.module.css'
import useInput from '../../hooks/use-input'
import Button from '@mui/material/Button';
import { changePassword, login, register } from '../../store/Auth/auth-actions'
import { authActions } from '../../store/Auth/auth-slice'
import { FilledInput, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, InputLabel, Radio, RadioGroup } from '@mui/material'

import { LOGIN, REGISTER, CHANGEPASSWORD } from '../../utils';
import { Visibility, VisibilityOff } from '@mui/icons-material'

const Customform = ({ pageType }) => {

    const dispatch = useDispatch();
    const loginState = useSelector(state => state.auth);

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
    const oldPassErrorMsg = 'Old Password is necessary and should be greater than or equal to 6 characters';

    const {
        value: passwordVer,
        isValid: isPassVerValid,
        hasError: hasPassVerError,
        valueChangeHandler: passVerChangeHandler,
        inputBlurHandler: passVerBlurHandler,
        reset: resetPassVer
    } = useInput(value => (value.length >= 6 && value === password));
    const passVerErrorMsg = 'Verify Password is necessary and should be same as Password';

    // emailUnameSelection: username, email
    const [emailUnameSelection, setEUSelection] = useState('username');

    useEffect(() => {
        resetName();
        resetUsername();
        resetEmail();
        resetPass();
        resetPassVer();
        resetOldPass();

        return () => dispatch(authActions.setError({ error: undefined }));
    }, [pageType, dispatch, resetName, resetUsername, resetEmail, resetPass, resetPassVer, resetOldPass]);

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
                            <CustomInput
                                id='name'
                                type='text'
                                label="Name"
                                value={name}
                                placeholder='Less than 10 characters'
                                blurHandler={nameBlurHandler}
                                changeHandler={nameChangeHandler}
                                hasError={hasNameError}
                                errorMsg={nameErrorMsg}
                            />
                        }

                        {pageType === LOGIN &&
                            <CustomRadioInput
                                id="login-mode"
                                value={emailUnameSelection}
                                onChange={event => setEUSelection(event.target.value)}
                                label="Select the login method you wish to use"
                                radioBtnList={[
                                    { value: "username", label: "Username" },
                                    { value: "email", label: "Email" }
                                ]}
                            />
                        }

                        {(pageType === REGISTER || pageType === CHANGEPASSWORD || emailUnameSelection === 'username') &&
                            <CustomInput
                                id='username'
                                type='text'
                                label="Username"
                                value={username}
                                placeholder='4 <= username < 10'
                                blurHandler={usernameBlurHandler}
                                changeHandler={usernameChangeHandler}
                                hasError={hasUsernameError}
                                errorMsg={usernameErrorMsg}
                            />
                        }

                        {(pageType === REGISTER || pageType === CHANGEPASSWORD || emailUnameSelection === 'email') &&
                            <CustomInput
                                id='email'
                                type='email'
                                label="Email"
                                value={email}
                                placeholder='Enter valid Email'
                                blurHandler={emailBlurHandler}
                                changeHandler={emailChangeHandler}
                                hasError={hasEmailError}
                                errorMsg={emailErrorMsg}
                            />
                        }

                        {pageType === CHANGEPASSWORD &&
                            <CustomPasswordInput
                                emailUnameSelection={emailUnameSelection}
                                pageType={pageType}
                                errorMsg={oldPassErrorMsg}
                                hasError={hasOldPassError}
                                id='oldPassword'
                                value={oldPassword}
                                changeHandler={oldPassChangeHandler}
                                blurHandler={oldPassBlurHandler}
                                label="Old Password"
                                placeholder='Minimum Length 6'
                            />
                        }

                        <CustomPasswordInput
                            emailUnameSelection={emailUnameSelection}
                            pageType={pageType}
                            errorMsg={passErrorMsg}
                            hasError={hasPassError}
                            id='password'
                            value={password}
                            changeHandler={passChangeHandler}
                            blurHandler={passBlurHandler}
                            label={`${pageType === CHANGEPASSWORD ? 'New ' : ''}Password`}
                            placeholder='Minimum Length 6'
                        />

                        {(pageType === REGISTER || pageType === CHANGEPASSWORD) &&
                            <CustomPasswordInput
                                emailUnameSelection={emailUnameSelection}
                                pageType={pageType}
                                errorMsg={passVerErrorMsg}
                                hasError={hasPassVerError}
                                id='passwordVerify'
                                value={passwordVer}
                                changeHandler={passVerChangeHandler}
                                blurHandler={passVerBlurHandler}
                                label='Re-Enter Password'
                                placeholder={`Same as ${pageType === CHANGEPASSWORD ? 'New ' : ''}Password`}
                            />
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

const CustomPasswordInput = ({ emailUnameSelection, pageType, errorMsg, hasError, id, value, changeHandler, label, placeholder, blurHandler }) => {

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        setShowPassword(false);
    }, [pageType, emailUnameSelection]);

    return (
        <div className='form-group mt-3'>
            <FormControl sx={{ width: '25ch' }} variant="filled">
                <InputLabel htmlFor={id}>{label}</InputLabel>
                <FilledInput
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={changeHandler}
                    onBlur={blurHandler}
                    placeholder={placeholder}
                    sx={hasError ? {
                        backgroundColor: '#fddddd',
                    } : {}}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            {hasError &&
                <div className={classes.validError}>
                    {errorMsg}
                </div>
            }
        </div>
    );
}

const CustomInput = ({ errorMsg, hasError, id, value, type, changeHandler, label, placeholder, blurHandler }) => {
    return (
        <div className='form-group mt-3'>
            <FormControl sx={{ width: '25ch' }} variant="filled">
                <InputLabel htmlFor={id}>{label}</InputLabel>
                <FilledInput
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={changeHandler}
                    onBlur={blurHandler}
                    sx={hasError ? {
                        backgroundColor: '#fddddd',
                    } : {}}
                />
            </FormControl>
            {hasError &&
                <div className={classes.validError}>
                    {errorMsg}
                </div>
            }
        </div>
    )
}

const CustomRadioInput = ({ id, value, onChange, label, radioBtnList }) => {
    return (
        <FormControl sx={{
            borderTop: '2px solid rgb(0,0,0,0.08)',
            borderBottom: '2px solid rgb(0,0,0,0.08)',
            marginTop: '0.5rem',
            padding: '0 0.7rem'
        }}>
            <FormLabel id={id}>{label}</FormLabel>
            <RadioGroup
                row
                aria-labelledby={id}
                name={id}
                value={value}
                onChange={onChange}
            >
                {
                    radioBtnList.map(btn => (
                        <FormControlLabel
                            value={btn.value}
                            control={<Radio />}
                            label={btn.label}
                        />
                    ))
                }
            </RadioGroup>
        </FormControl>
    );
}

export default Customform;