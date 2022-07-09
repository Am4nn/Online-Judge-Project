import React, { Suspense, useEffect } from 'react'
import classes from './App.module.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import NavBar from './compenents/NavBar/NavBar';
import LoadingSpinner from './compenents/LoadingSpinner/LoadingSpinner';

import { useSelector, useDispatch } from 'react-redux';
import { fetchQuestionListData, sendQuestionListData } from './store/questions-actions';

const Home = React.lazy(() => import('./pages/Home/Home'));
const QuestionList = React.lazy(() => import('./pages/QuestionList/QuestionList'));
const Question = React.lazy(() => import('./pages/Question/Question'));
const LeaderBoard = React.lazy(() => import('./pages/LeaderBoard/LeaderBoard'));


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
                <div className={classes.routes}>
                    <Suspense
                        fallback={<div className='centered'><LoadingSpinner /></div>}>
                        <Routes>
                            <Route exact path='/' element={<Home />} />
                            <Route exact path='/questions' element={<QuestionList />} />
                            <Route exact path='/questions/:id' element={<Question />} />
                            <Route exact path='/leaderboard' element={<LeaderBoard />} />
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;