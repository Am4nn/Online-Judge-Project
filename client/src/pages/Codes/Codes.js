import React, { Fragment, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { SERVER_LINK } from '../../dev-server-link';
import CodeEditorv3 from '../Question/Editor/CodeEditorv3';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ButtonCustom from '../../compenents/Button/Button';

import classes from './Codes.module.css';
import Options from '../Question/Options/Options';

const Codes = () => {
    const [response, setResponse] = useState('');
    const [codeFontSize, setcodeFontSize] = useState(15);

    const [searchParams] = useSearchParams();

    let filepath = null, language = null;
    if (searchParams.get('filepath') && searchParams.get('language')) {
        filepath = searchParams.get('filepath');
        language = searchParams.get('language');
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
                    <div className={classes.container}>
                        <div className={classes.contain}>
                            <div className={classes.back}>
                                <div className={classes.codeSnippet}>
                                    &#60; go back to leaderboard /&#62;
                                </div>
                                <ButtonCustom to='/leaderboard' color='yellow'>
                                    <ArrowBackIcon style={{ marginRight: '0.3em', transform: 'translateX(-12px)', fontSize: '1.2em' }} />
                                    Back
                                </ButtonCustom>
                            </div>
                            <Options
                                favStyle={{
                                    zIndex: '899',
                                    position: 'relative',
                                    left: '33%',
                                    bottom: '1rem'
                                }}
                                codeFontSize={codeFontSize}
                                setcodeFontSize={setcodeFontSize}
                            />
                            <CodeEditorv3
                                code={response.code}
                                setCode={null}
                                language={language}
                                fontSize={codeFontSize}
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