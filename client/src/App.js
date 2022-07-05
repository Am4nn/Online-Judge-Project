import React from 'react'
import classes from './App.module.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home';
import QuestionList from './pages/QuestionList/QuestionList';
import Question from './pages/Question/Question';
import LeaderBoard from './pages/LeaderBoard/LeaderBoard';
import NavBar from './compenents/NavBar/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css'

const App = () => {
    return (
        <BrowserRouter>
            <div className={classes.App}>
                <NavBar />
                <div className={classes.routes}>
                    <Routes>
                        <Route exact path='/' element={<Home />} />
                        <Route exact path='/questions' element={<QuestionList />} />
                        <Route exact path='/questions/:id' element={<Question />} />
                        <Route exact path='/leaderboard' element={<LeaderBoard />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;

// const onFormSubmitted = async (name, email, password) => {
//     let res = await fetch('http://localhost:5000/api/test/r1', {
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         method: 'POST',
//         body: JSON.stringify({
//             name, email, password
//         })
//     });
//     const ans = await res.json();
//     console.log(ans);
// }