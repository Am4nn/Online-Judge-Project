import React from 'react'
import classes from './styles.module.css'

const SlidingBtn = props => {
    return (
        <button className={classes.learnMore + ' ' + classes.button}>
            <span className={classes.circle} aria-hidden="true">
                <span className={classes.icon + ' ' + classes.arrow}>
                    {props.children}
                </span>
            </span>
            <span className={classes.buttonText}>{props.text}</span>
        </button>
    )
}

export default SlidingBtn