import React, { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import { SERVER_LINK } from '../../dev-server-link';
import CodeEditorv3 from '../Question/Editor/CodeEditorv3';

const Codes = () => {
    const [response, setResponse] = useState('');
    const { state } = useLocation();
    let filepath = null, language = null;
    if (state) {
        filepath = state.filepath;
        language = state.language;
    }

    useEffect(() => {
        if (!filepath) return;
        fetch(
            `${SERVER_LINK}/api/explore/getcode`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ filepath })
            }
        )
            .then(res => res.json())
            .then(data => setResponse(data))
            .catch(error => setResponse({
                error: `server side error, check your network
${error}`
            }))
    }, [filepath])

    return (
        <Fragment>

            {!filepath && <div className='errorTemplate'><span>Error : </span>You should come to this page by clicking button on leader board / or might be possible that code for this query was never written/saved.</div>}
            {response.error && <div className='errorTemplate'><span>Error : </span>{response.error}</div>}

            {
                filepath && !response.error && (
                    <CodeEditorv3
                        code={response.code}
                        setCode={null}
                        language={language}
                        fontSize={16}
                        isReadOnly={true}
                    />
                )
            }
        </Fragment >
    )
}

export default Codes;