import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { useSelector } from 'react-redux';

import { LOGIN, REGISTER, CHANGEPASSWORD } from '../../utils'

// const Home = React.lazy(() => import('./pages/Home/Home'));
const QuestionList = React.lazy(() => import('../../pages/QuestionList/QuestionList'));
const Question = React.lazy(() => import('../../pages/Question/Question'));
const LeaderBoard = React.lazy(() => import('../../pages/LeaderBoard/LeaderBoard'));
const Codes = React.lazy(() => import('../../pages/Codes/Codes'));
const NotFound = React.lazy(() => import('../../pages/NotFound/NotFound'));
const DashBoard = React.lazy(() => import('../../pages/DashBoard/DashBoard'));
const Account = React.lazy(() => import('../../pages/Account/Account'));
const LinkShortner = React.lazy(() => import('../../pages/LinkShortner/LinkShortner'));
const Notes = React.lazy(() => import('../../pages/Notes/Notes'));
const ServerLogs = React.lazy(() => import('../../pages/ServerLogs/ServerLogs'));
const Customform = React.lazy(() => import('../Customform/Customform'));


const NavigationStack = () => {

    const loginState = useSelector(state => state.auth);

    return (
        <main style={{ marginTop: '5rem' }}>
            <Suspense
                fallback={<div className='centered'><LoadingSpinner /></div>}>
                <Routes>
                    {/* <Route exact path='/' element={<Home />} /> */}
                    <Route exact path='/' element={<Navigate replace to='/questions' />} />
                    <Route exact path='/questions' element={<QuestionList />} />
                    <Route exact path='/questions/:id' element={<Question />} />
                    <Route exact path='/leaderboard' element={<LeaderBoard />} />
                    <Route exact path='/codes/:id' element={<Codes />} />
                    <Route exact path='/login' element={!loginState.loggedIn ? <Customform pageType={LOGIN} /> : <Navigate replace to='/questions' />} />
                    <Route exact path='/register' element={!loginState.loggedIn ? <Customform pageType={REGISTER} /> : <Navigate replace to='/questions' />} />
                    <Route exact path='/changePassword' element={<Customform pageType={CHANGEPASSWORD} />} />
                    <Route exact path='/dashboard' element={loginState.loggedIn ? <DashBoard /> : <Navigate replace to='/questions' />} />
                    <Route exact path='/account' element={<Account />} />
                    <Route exact path='/notes' element={<Notes />} />
                    <Route exact path='/linkShortner' element={<LinkShortner />} />
                    <Route exact path='/serverLogs' element={<ServerLogs />} />
                    <Route exact path='*' element={<NotFound />} />
                </Routes>
            </Suspense>
        </main>
    )
}

export default NavigationStack;