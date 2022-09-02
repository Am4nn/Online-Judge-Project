import React from 'react'
import { Link } from 'react-router-dom'
import classes from './styles.module.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGhost, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import SlidingBtn from '../../compenents/SlidingBtn/SlidingBtn'


const NotFound = () => {
    return (
        <section className={classes.section}>
            <div className={classes.bady}></div>
            <main className={classes.section}>
                <h1 className={classes.h1}>
                    4
                    <span className={classes.span}>
                        <FontAwesomeIcon icon={faGhost} />
                    </span>
                    4
                </h1>
                <h2 className={classes.h2}>Error: 404 page not found</h2>
                <p className={classes.p}>Sorry, the page you're looking for cannot be accessed</p>

                <div className={classes.containerx}>
                    <Link to='/' className={classes.link}>
                        <SlidingBtn text='Home Page'>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </SlidingBtn>
                    </Link>
                </div>
            </main>
        </section >
    )
}

export default NotFound