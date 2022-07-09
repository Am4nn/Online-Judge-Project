import React, { useState } from 'react'

import Fab from '@mui/material/Fab'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTop = () => {

    const [atTop, setAtTop] = useState(true);

    const toggleAtTop = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 100) setAtTop(false)
        else if (scrolled <= 100) setAtTop(true)
    }

    const scrollHandler = () => {
        window.scrollTo(0, 0);
    }

    window.addEventListener('scroll', toggleAtTop);


    if (atTop) return null;
    return (
        <Fab style={{
            position: 'fixed',
            bottom: '1em',
            right: '1em',
            opacity: '0.9'
        }} onClick={scrollHandler} size="small" color="primary" aria-label="add">
            <KeyboardArrowUpIcon />
        </Fab>
    );
}

export default ScrollToTop;