import React, { useCallback, useEffect, useState } from 'react'

import Fab from '@mui/material/Fab'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Tooltip, Zoom } from '@mui/material';

const ScrollToTop = props => {

    const { element } = props;

    const [atTop, setAtTop] = useState(true);

    const toggleAtTop = useCallback(() => {
        const scrolled = element ? element.scrollTop : document.documentElement.scrollTop;
        if (scrolled > 100) setAtTop(false)
        else if (scrolled <= 100) setAtTop(true)
    }, [element]);

    const scrollHandler = () => {
        if (element) element.scrollTo(0, 0);
        else window.scrollTo(0, 0);
    }

    useEffect(() => {
        if (element) element.addEventListener('scroll', toggleAtTop);
        else window.addEventListener('scroll', toggleAtTop);
    }, [toggleAtTop, element]);


    if (atTop) return null;
    return (
        <Tooltip
            arrow
            placement='top'
            TransitionComponent={Zoom}
            title='Scroll To Top'
        >
            <Fab style={{
                position: 'fixed',
                bottom: '1em',
                right: '1em',
                opacity: '0.9'
            }} onClick={scrollHandler} size="small" color="primary" aria-label="add">
                <KeyboardArrowUpIcon />
            </Fab>
        </Tooltip>
    );
}

export default ScrollToTop;