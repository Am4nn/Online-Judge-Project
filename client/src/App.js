import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import classes from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css'

import NavBar from './compenents/NavBar/NavBar';
import ScrollToTop from './compenents/ScrollToTop/ScrollToTop';
import LoadingSpinner from './compenents/LoadingSpinner/LoadingSpinner';

import { useSelector, useDispatch } from 'react-redux';
import { fetchQuestionListData, sendQuestionListData } from './store/questions-actions';

// const Home = React.lazy(() => import('./pages/Home/Home'));
const QuestionList = React.lazy(() => import('./pages/QuestionList/QuestionList'));
const Question = React.lazy(() => import('./pages/Question/Question'));
const LeaderBoard = React.lazy(() => import('./pages/LeaderBoard/LeaderBoard'));
const Codes = React.lazy(() => import('./pages/Codes/Codes'));


let isInitial = true;


const App = () => {

    const dispatch = useDispatch();
    const problems = useSelector(state => state.questions);

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
                            <Route exact path='/questions' element={<QuestionList />} />
                            <Route exact path='/questions/:id' element={<Question />} />
                            <Route exact path='/leaderboard' element={<LeaderBoard />} />
                            <Route exact path='/codes/:id' element={<Codes />} />
                            <Route exact path='*' element={<Navigate replace to='/questions' />} />
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;