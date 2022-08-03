import React, { useState, useEffect, Fragment } from 'react'
import Card from './Card/Card';
import Filter from './Filter/Filter';
import classes from './QuestionList.module.css'

import { useSelector } from 'react-redux';

import Fab from '@mui/material/Fab'
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

import { useMediaQuery } from 'react-responsive'
import LoadingSpinner from '../../compenents/LoadingSpinner/LoadingSpinner';


const QuestionList = () => {

    const [easy, setEasy] = useState(false);
    const [medium, setMedium] = useState(false);
    const [hard, setHard] = useState(false);

    const problems = useSelector(state => state.questions);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {

        if (!easy && !medium && !hard) {
            setQuestions(problems.questions);
            return;
        }
        setQuestions(problems.questions.filter(element => {
            if (
                (easy && element.difficulty === 'easy') ||
                (medium && element.difficulty === 'medium') ||
                (hard && element.difficulty === 'hard')
            ) return true;
            return false;
        }));

    }, [easy, medium, hard, problems])

    const isMobile = useMediaQuery({
        query: '(max-width:1000px)'
    })

    const [isSideBar, setSideBar] = useState(false);

    return (
        <div className={classes.questions}>
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
                                {isMobile && (
                                    <Fab
                                        onClick={() => setSideBar(prev => !prev)}
                                        style={{ position: 'fixed', marginLeft: '1em', marginTop: '0.6rem' }} color="secondary"
                                        aria-label="filter"
                                    >
                                        {isSideBar ? <CloseIcon /> : <EditIcon />}
                                    </Fab>
                                )}
                                {(isSideBar || !isMobile) && (<div className={classes.filter}>
                                    <div className={classes.filterabs}>
                                        <Filter
                                            setEasy={setEasy}
                                            setMedium={setMedium}
                                            setHard={setHard}
                                            easy={easy}
                                            medium={medium}
                                            hard={hard}
                                        />
                                    </div>
                                </div>)}

                                <div className={classes.cards}>
                                    {questions.map(problem => <Card key={problem._id} question={problem} />)}
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

export default QuestionList;