import React, { useState, useEffect } from 'react'
import Card from './Card/Card';
import Filter from './Filter/Filter';
import classes from './QuestionList.module.css'

import { useSelector } from 'react-redux';

import Fab from '@mui/material/Fab'
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

import { useMediaQuery } from 'react-responsive'


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
        </div>
    )
}

export default QuestionList;