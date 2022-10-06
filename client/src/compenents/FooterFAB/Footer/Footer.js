import React, { Fragment } from 'react'
import { FavoriteBorder, GitHub, Instagram, LinkedIn, Mail } from '@mui/icons-material';
import { Box } from '@mui/material';
import classes from './Footer.module.css';

const Footer = () => {

    const clickHandler = link => {
        window.open(link, '_blank');
    }

    return (
        <Fragment>
            <Box sx={{ borderBottom: '1.5px solid rgba(0,0,0,0.1)' }}>
                <span onClick={() => clickHandler("https://www.instagram.com/am4n_arya")}>
                    <Instagram className={classes.logos} />
                </span>
                <span onClick={() => clickHandler("https://github.com/Am4nn")}>
                    <GitHub className={classes.logos} />
                </span>
                <span onClick={() => clickHandler("https://www.linkedin.com/in/aman-arya-79a52121b")}>
                    <LinkedIn className={classes.logos} />
                </span>
                <span onClick={() => clickHandler("mailto:125aryaaman@gmail.com")}>
                    <Mail className={classes.logos} />
                </span>
            </Box>
            <div>Copyright ©2022 All rights reserved</div>
            <div>This Website is made with <FavoriteBorder /></div>
            <div>by <a style={{ textDecoration: 'none' }} href="https://www.linkedin.com/in/aman-arya-79a52121b" target="_blank" rel="noopener noreferrer">
                Aman Arya
            </a></div>
        </Fragment>
    )
}

export default Footer;