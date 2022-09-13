import React, { Fragment, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { SERVER_LINK } from '../../dev-server-link';
import CodeEditorv3 from '../Question/Editor/CodeEditorv3';
import ButtonCustom from '../../compenents/Button/Button';
import Options from '../Question/Options/Options';
import classes from './Codes.module.css';

import { ArrowBack, Check, ContentCopy } from '@mui/icons-material';
import { IconButton, Tooltip, Zoom } from '@mui/material';

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

    const [copied, setCopied] = useState(false);

    if (copied === true)
        setTimeout(() => setCopied(false), 2000);

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
                                    <ArrowBack style={{ marginRight: '0.3em', transform: 'translateX(-12px)', fontSize: '1.2em' }} />
                                    Back
                                </ButtonCustom>
                            </div>
                            <div style={{ position: 'absolute' }}>
                                <Tooltip TransitionComponent={Zoom} title={copied ? 'Copied' : 'Copy'} placement='right'>
                                    <IconButton
                                        onClick={() => {
                                            navigator.clipboard.writeText(response.code);
                                            setCopied(true);
                                        }}
                                        aria-label={copied ? 'Copied' : 'Copy'}
                                    >
                                        {copied ? <Check /> : <ContentCopy />}
                                    </IconButton>
                                </Tooltip>
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