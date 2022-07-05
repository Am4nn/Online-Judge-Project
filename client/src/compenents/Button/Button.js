import React from 'react'
import classes from './Button.module.css'
import { Link } from 'react-router-dom'

const Button = props => {
    return (
        <Link to={props.to} className={classes.btn}>
            <span>{props.children}</span>
        </Link>
    )
}

export default Button;