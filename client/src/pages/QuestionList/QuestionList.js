import React, { useState, useEffect, Fragment, useRef } from 'react'
import Card from './Card/Card';
import Filter from './Filter/Filter';
import classes from './QuestionList.module.css'

import { useSelector } from 'react-redux';

import Fab from '@mui/material/Fab'
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { ClickAwayListener, Slide, useMediaQuery } from '@mui/material'

import LoadingSpinner from '../../compenents/LoadingSpinner/LoadingSpinner';
import ScrollToTop from '../../compenents/ScrollToTop/ScrollToTop';


const QuestionList = () => {

    const [easy, setEasy] = useState(false);
    const [medium, setMedium] = useState(false);
    const [hard, setHard] = useState(false);
    const [solved, setSolved] = useState(false);
    const [unsolved, setUnsolved] = useState(false);
    const cardsRef = useRef(null);

    const { loggedIn, solvedQuestions } = useSelector(state => state.auth);
    const problems = useSelector(state => state.questions);
    const [questions, setQuestions] = useState([]);

    useFilterQuestions({ easy, medium, hard, problems, solved, unsolved, solvedQuestions, setQuestions });

    const isMobile = useMediaQuery('(max-width:1000px)');
    const [isSideBar, setSideBar] = useState(false);

    return (
        <div className={classes.questions}>
            <ScrollToTop element={cardsRef.current} />
            {
                (problems.isLoading) ?
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%'
                    }}
                    >
                        <LoadingSpinner />
                    </div> : (
                        (problems && problems.questions && problems.questions.length > 0) ? (
                            <Fragment>
                                {isMobile ? (
                                    <ClickAwayListener onClickAway={() => setSideBar(false)}>
                                        <div>
                                            <Fab
                                                onClick={() => setSideBar(prev => !prev)}
                                                style={{ position: 'fixed', marginLeft: '0.9rem', marginTop: '0.6rem', opacity: '0.8' }} color="secondary"
                                                aria-label="filter"
                                            >
                                                {isSideBar ? <CloseIcon /> : <EditIcon />}
                                            </Fab>
                                            <Slide direction="right" in={(isSideBar || !isMobile)} mountOnEnter unmountOnExit>
                                                <div className={classes.filterabs}>
                                                    <Filter
                                                        setEasy={setEasy}
                                                        setMedium={setMedium}
                                                        setHard={setHard}
                                                        easy={easy}
                                                        medium={medium}
                                                        hard={hard}
                                                        loggedIn={loggedIn}
                                                        solved={solved}
                                                        setSolved={setSolved}
                                                        unsolved={unsolved}
                                                        setUnsolved={setUnsolved}
                                                    />
                                                </div>
                                            </Slide>
                                        </div>
                                    </ClickAwayListener>
                                ) : (
                                    <div className={classes.filter}>
                                        <div className={classes.filterabs}>
                                            <Filter
                                                setEasy={setEasy}
                                                setMedium={setMedium}
                                                setHard={setHard}
                                                easy={easy}
                                                medium={medium}
                                                hard={hard}
                                                loggedIn={loggedIn}
                                                solved={solved}
                                                setSolved={setSolved}
                                                unsolved={unsolved}
                                                setUnsolved={setUnsolved}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className={classes.cards} ref={cardsRef}>
                                    {questions.map(problem => <Card solved={loggedIn && solvedQuestions.includes(problem._id)} key={problem._id} question={problem} />)}
                                </div>
                            </Fragment>
                        ) : (
                            <div style={{ width: '100%' }}>
                                <div className='errorTemplate'>
                                    <div><span>Msg : </span>Looks like there are no questions here !</div>
                                    {<div><span>Cause : </span>Check if your not offline / Or may be server is down.</div>}
                                </div>
                            </div>
                        )
                    )
            }
        </div>
    )
}

const useFilterQuestions = ({ easy, medium, hard, problems, solved, unsolved, solvedQuestions, setQuestions }) => {
    useEffect(() => {
        if (!easy && !medium && !hard) {
            setQuestions(problems.questions);
        }
        else setQuestions(problems.questions.filter(element => (
            (easy && element.difficulty === 'easy') ||
            (medium && element.difficulty === 'medium') ||
            (hard && element.difficulty === 'hard')
        )));

        if (solved || unsolved)
            setQuestions(questions => questions.filter(ele => (
                (solved && solvedQuestions.includes(ele._id)) ||
                (unsolved && !solvedQuestions.includes(ele._id))
            )));

    }, [easy, medium, hard, problems, solved, unsolved, solvedQuestions, setQuestions])
}

export default QuestionList;
