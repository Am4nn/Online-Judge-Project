import React from 'react'
import { useParams } from 'react-router';

const Question = () => {
    const { id } = useParams();
    console.log(id);

    return (
        <div>Question</div>
    )
}

export default Question;