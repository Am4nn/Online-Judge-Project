import React from 'react'
import AnimatedCursor from 'react-animated-cursor';

const Ccursor = props => {
    return (
        <div className="customCursor">
            <AnimatedCursor
                innerSize={10}
                outerSize={40}
                color="255, 127, 80"
                outerAlpha={0.2}
                innerScale={0.5}
                outerScale={2}
            />
            {props.children}
        </div>
    )
}

export default Ccursor;