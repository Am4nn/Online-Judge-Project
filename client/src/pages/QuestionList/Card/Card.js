import React from 'react'
import classes from './Card.module.css'
import Button from '../../../compenents/Button/Button'

import CodeIcon from '@mui/icons-material/Code';

const Card = props => {
    const { question, solved } = props;

    return (
        <div className={classes.Card}>
            <div className={classes.left}>
                <div className={classes.questionName}>
                    {question.name}
                </div>
            </div>
            <div className={classes.mid}>
                <div className={classes.level} diff-color={question.difficulty}>{question.difficulty}</div>
                <div className={classes.succ}>{question.noOfSuccess === 0 ? 0 : ((question.noOfSuccess / question.noOfSubm * 100).toFixed(2))}% Success</div>
            </div>
            <div className={classes.right}>
                <Button to={`/questions/${question._id}`} color={solved ? 'grey' : 'blue'}>
                    {solved ? "Solved" : "Solve"}
                    <CodeIcon fontSize='large' style={{ marginLeft: '0.5em' }} />
                </Button>
            </div>
        </div>
    )
}

export default Card;