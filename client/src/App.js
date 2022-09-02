import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import classes from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css'

import NavBar from './compenents/NavBar/NavBar';
import ScrollToTop from './compenents/ScrollToTop/ScrollToTop';
import LoadingSpinner from './compenents/LoadingSpinner/LoadingSpinner';

import { useSelector, useDispatch } from 'react-redux';
import { fetchQuestionListData, sendQuestionListData } from './store/questions-actions';
import { getLoggedIn } from './store/auth-actions'

// const Home = React.lazy(() => import('./pages/Home/Home'));
const QuestionList = React.lazy(() => import('./pages/QuestionList/QuestionList'));
const Question = React.lazy(() => import('./pages/Question/Question'));
const LeaderBoard = React.lazy(() => import('./pages/LeaderBoard/LeaderBoard'));
const Codes = React.lazy(() => import('./pages/Codes/Codes'));
const NotFound = React.lazy(() => import('./pages/NotFound/NotFound'));
const DashBoard = React.lazy(() => import('./pages/DashBoard/DashBoard'));
const Account = React.lazy(() => import('./pages/Account/Account'));
const Customform = React.lazy(() => import('./compenents/Customform/Customform'));


let isInitial = true;


const App = () => {

    const dispatch = useDispatch();
    const problems = useSelector(state => state.questions);

    const loginState = useSelector(state => state.auth);
    // console.log(loggedIn.loggedIn)

    useEffect(() => {
        dispatch(getLoggedIn());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchQuestionListData());
    }, [dispatch]);


    useEffect(() => {
        if (isInitial) {
            isInitial = false;
            return;
        }

        if (problems.changedQuestions) {
            dispatch(sendQuestionListData(problems));
        }
    }, [problems, dispatch]);


    return (
        <BrowserRouter>
            <div className={classes.App}>
                <NavBar />
                <ScrollToTop />
                <div className={classes.routes}>
                    <Suspense
                        fallback={<div className='centered'><LoadingSpinner /></div>}>
                        <Routes>
                            {/* <Route exact path='/' element={<Home />} /> */}
                            <Route exact path='/' element={<Navigate replace to='/questions' />} />
                            <Route exact path='/questions' element={<QuestionList />} />
                            <Route exact path='/questions/:id' element={<Question />} />
                            <Route exact path='/leaderboard' element={<LeaderBoard />} />
                            <Route exact path='/codes/:id' element={<Codes />} />
                            <Route exact path='/login' element={loginState.loggedIn === false ? <Customform pageType="login" /> : <Navigate replace to='/questions' />} />
                            <Route exact path='/register' element={loginState.loggedIn === false ? <Customform pageType="register" /> : <Navigate replace to='/questions' />} />
                            <Route exact path='/dashboard' element={<DashBoard />} />
                            <Route exact path='/account' element={<Account />} />
                            <Route exact path='*' element={<NotFound />} />
                            {/* <Route exact path='*' element={<Navigate replace to='/questions' />} /> */}
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;