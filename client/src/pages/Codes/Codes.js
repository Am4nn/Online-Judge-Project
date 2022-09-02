import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { SERVER_LINK } from '../../dev-server-link';
import CodeEditorv3 from '../Question/Editor/CodeEditorv3';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ButtonCustom from '../../compenents/Button/Button';

import classes from './Codes.module.css';

const Codes = () => {
    const [response, setResponse] = useState('');

    const [searchParams] = useSearchParams();

    let filepath = null, language = null;
    if (searchParams.get('filepath') && searchParams.get('language')) {
        filepath = searchParams.get('filepath');
        language = searchParams.get('language');
    }

    const navigator = useNavigate();
    const backBtnHandler = () => navigator(-1);

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
                    <div className={classes.container}>
                        <div style={{ width: '80%' }}>
                            <div className={classes.back}>
                                <div className={classes.codeSnippet}>
                                    &#60; go back to leaderboard /&#62;
                                </div>
                                <ButtonCustom to='/' onClick={backBtnHandler} color='yellow'>
                                    <ArrowBackIcon style={{ marginRight: '0.3em', transform: 'translateX(-12px)', fontSize: '1.2em' }} />
                                    Back
                                </ButtonCustom>
                            </div>
                            <CodeEditorv3
                                code={response.code}
                                setCode={null}
                                language={language}
                                fontSize={16}
                                isReadOnly={true}
                            />
                        </div>
                    </div>
                )
            }
        </Fragment >
    )
}

export default Codes;