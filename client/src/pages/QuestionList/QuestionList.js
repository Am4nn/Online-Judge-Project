import React, { useEffect, useState } from 'react'
import Card from './Card/Card';
import Filter from './Filter/Filter';
import classes from './QuestionList.module.css'

const QuestionList = () => {

    const [problems, Setproblems] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/explore/problems', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET',
        })
            .then(problems => problems.json())
            .then(problems => Setproblems(problems));
    }, []);

    return (
        <div className={classes.questions}>
            <div className={classes.filter}>
                <Filter />
            </div>
            <div className={classes.cards}>
                {problems.map(problem => <Card key={problem._id} question={problem} />)}
            </div>
        </div>
    )
}

export default QuestionList;