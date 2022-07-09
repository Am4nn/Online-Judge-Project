import React from 'react'
import classes from './Card.module.css'
import Button from '../../../compenents/Button/Button'

const Card = props => {
    const { question } = props;
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
                <Button to={`/questions/${question._id}`} color='blue'>Solve</Button>
            </div>
        </div>
    )
}

export default Card;