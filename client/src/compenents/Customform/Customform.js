import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import classes from './Customform.module.css'
import useInput from '../../hooks/use-input'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { login, register } from '../../store/auth-actions'
import { authActions } from '../../store/auth-slice'

const Customform = props => {

    const { pageType } = props; // login, register

    const dispatch = useDispatch();
    const navigator = useNavigate();
    const loginState = useSelector(state => state.auth);

    if (loginState.loggedIn) {
        // this block never runs, as /login and /register routes get disabled
        console.log(`${pageType === 'login' ? 'Logged In' : 'Registered'} Successfully`);
        dispatch(authActions.setError({ error: undefined }));
        navigator('/questions');
    }

    useEffect(() => {
        // console.log(`${pageType} page`);
        return () => dispatch(authActions.setError({ error: undefined }));
    }, [dispatch, pageType]);

    const {
        value: name,
        isValid: isNameValid,
        hasError: hasNameError,
        valueChangeHandler: nameChangeHandler,
        inputBlurHandler: nameBlurHandler,
    } = useInput(value => (value.trim() !== '' && value.length < 10));

    const {
        value: email,
        isValid: isEmailValid,
        hasError: hasEmailError,
        valueChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
    } = useInput(value => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)));

    const {
        value: password,
        isValid: isPassValid,
        hasError: hasPassError,
        valueChangeHandler: passChangeHandler,
        inputBlurHandler: passBlurHandler,
        reset: resetPass
    } = useInput(value => (value.length >= 6));

    const {
        value: passwordVer,
        isValid: isPassVerValid,
        hasError: hasPassVerError,
        valueChangeHandler: passVerChangeHandler,
        inputBlurHandler: passVerBlurHandler,
        reset: resetPassVer
    } = useInput(value => (value.length >= 6 && value === password));

    const isFormValid = isEmailValid && isPassValid && (pageType === 'login' || (isNameValid && isPassVerValid));

    const loginHandler = () => {
        // console.log('login data : ', email, password);
        dispatch(login(email, password));
    }
    const registerHandler = () => {
        // console.log('register data : ', name, email, password, passwordVer);
        dispatch(register(name, email, password, passwordVer));
    }

    const formSubmitHandler = event => {
        event.preventDefault();

        if (!isFormValid) return;
        if (pageType === 'login') loginHandler();
        else if (pageType === 'register') registerHandler();

        resetPass();
        resetPassVer();
    }


    return (
        <div className={classes["Auth-form-container"]}>
            <form className={classes["Auth-form"]} onSubmit={formSubmitHandler}>
                <div className={classes["Auth-form-content"]}>
                    <h3 className={classes["Auth-form-title"]}>
                        {pageType === 'login' ? 'Sign In' : 'Sign Up'}
                    </h3>
                    <div className="text-center">
                        {pageType === 'login' ? "Don't have an account? " : 'Already have an account '}

                        <Link to={pageType === 'login' ? '/register' : '/login'} className="link-primary">
                            {pageType === 'login' ? 'Sign Up' : 'Sign In'}
                        </Link>
                    </div>

                    {pageType === 'register' &&
                        <div className='form-group mt-4'>
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
                        </div>
                    }

                    <div className='form-group mt-4'>
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
                    </div>

                    <div className='form-group mt-3'>
                        <TextField
                            id='password'
                            type='password'
                            label="Password"
                            placeholder='Minimum Length 6'
                            variant="filled"
                            onBlur={passBlurHandler}
                            onChange={passChangeHandler}
                            value={password}
                            sx={hasPassError ? {
                                backgroundColor: '#fddddd',
                            } : {}}
                        />
                    </div>

                    {pageType === 'register' &&
                        <div className='form-group mt-3'>
                            <TextField
                                id='passwordVerify'
                                type='password'
                                label="Re-Enter Password"
                                placeholder='Same as password'
                                variant="filled"
                                onBlur={passVerBlurHandler}
                                onChange={passVerChangeHandler}
                                value={passwordVer}
                                sx={hasPassVerError ? {
                                    backgroundColor: '#fddddd',
                                } : {}}
                            />
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
                            {pageType === 'login' ? 'Login' : 'Register'}
                            {loginState && (loginState.isLoading || loginState.loggedIn) && <div className='spin' />}
                        </Button>
                    </div>


                    {loginState && loginState.error && (
                        <div className={classes.errormsg}>
                            {loginState.error}
                        </div>
                    )}

                    <div className='text-muted'>
                        Email must be valid and Password length must be greater than or equal to 6 to submit.
                    </div>
                </div>
            </form >
        </div >
    )
}

export default Customform;