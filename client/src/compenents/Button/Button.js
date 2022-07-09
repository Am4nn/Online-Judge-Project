import React from 'react'
import classes from './Button.module.css'
import { Link } from 'react-router-dom'

const Button = props => {
    const handler = props.onClick ? props.onClick : () => { };
    return (
        <Link onClick={handler} to={props.to} className={`${classes.btn} ${classes[props.color]}`}>
            <span>{props.children}</span>
        </Link >
    )
}

export default Button;