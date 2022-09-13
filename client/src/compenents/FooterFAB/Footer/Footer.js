import React, { Fragment } from 'react'
import { FavoriteBorder } from '@mui/icons-material';

const Footer = () => {
    return (
        <Fragment>
            <div>Copyright ©2022 All rights reserved</div>
            <div>This Website is made with <FavoriteBorder /></div>
            <div>by <a style={{ textDecoration: 'none' }} href="https://www.linkedin.com/in/aman-arya-79a52121b" target="_blank" rel="noopener noreferrer">
                Aman Arya
            </a></div>
        </Fragment>
    )
}

export default Footer;