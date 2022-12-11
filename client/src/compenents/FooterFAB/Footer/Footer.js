import React, { Fragment } from 'react'
import { FavoriteBorder, GitHub, Instagram, LinkedIn, Mail, StarBorder } from '@mui/icons-material';
import { Box } from '@mui/material';
import classes from './Footer.module.css';
import { SERVER_LINK } from '../../../dev-server-link';

const Footer = () => {

    const clickHandler = (link, name) => {
        window.open(link, '_blank');

        fetch(
            `${SERVER_LINK}/api/experimental/log`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ msg: `Visited ${name}` }),
                credentials: 'include'
            }
        ).catch(error => console.error(error));
    }

    return (
        <Fragment>
            <Box sx={{ borderBottom: '1.5px solid rgba(0,0,0,0.1)' }}>
                <span onClick={() => clickHandler("https://www.instagram.com/am4n_arya", 'Instagram')}>
                    <Instagram className={classes.logos} />
                </span>
                <span onClick={() => clickHandler("https://github.com/Am4nn", 'Github')}>
                    <GitHub className={classes.logos} />
                </span>
                <span onClick={() => clickHandler("https://www.linkedin.com/in/aman-arya-79a52121b", 'LinkedIn')}>
                    <LinkedIn className={classes.logos} />
                </span>
                <span onClick={() => clickHandler("mailto:125aryaaman@gmail.com", 'Mail')}>
                    <Mail className={classes.logos} />
                </span>
            </Box>
            <div>Copyright ©2022 All rights reserved</div>
            <div>This Website is made with <FavoriteBorder /></div>
            <div>by <a style={{ textDecoration: 'none' }} href="https://www.linkedin.com/in/aman-arya-79a52121b" target="_blank" rel="noopener noreferrer">
                Aman Arya
            </a></div>
            <div>Give this website a <a style={{ textDecoration: 'none' }} href="https://github.com/Am4nn/Online-Judge-Project" target="_blank" rel="noopener noreferrer">
                <StarBorder /> <span style={{ color: 'black' }}>on</span> GitHub
            </a></div>
        </Fragment>
    )
}

export default Footer;