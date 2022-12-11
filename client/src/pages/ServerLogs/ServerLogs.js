import React, { useState, useEffect, Fragment, useRef } from 'react'
import { useSelector } from 'react-redux';
import { Button, Fab, Paper, Box } from '@mui/material';
import { KeyboardArrowDown, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, Visibility } from '@mui/icons-material';
import { v4 } from 'uuid';
import io from 'socket.io-client';
import { SERVER_LINK } from '../../dev-server-link';
import './ServerLogs.css';
import LoadingSpinner from './../../compenents/LoadingSpinner/LoadingSpinner';

const ServerLogs = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);
    const [stdout, setStdout] = useState({});
    const [stderr, setStderr] = useState({});
    const [isOut, setIsOut] = useState(true);
    const endRef = useRef(null);
    const [pageNo, setPageNo] = useState(1);

    useFetchServerLogs(setLoading, setError, setStderr, setStdout, pageNo);
    useServerLogsSocket(setStdout, setStderr);
    useColorTokens([isOut, stderr, stdout]);

    return (
        <Fragment>
            <Tools
                endRef={endRef} isOut={isOut} pageNo={pageNo}
                setIsOut={setIsOut} setPageNo={setPageNo}
            />
            {loading && <LoadingSpinner />}
            {!loading && error && <div className='errorTemplate' style={{ width: '70vw' }}>
                <div><span>Msg : </span>{error.msg}</div>
                {error && <div><span>Error : </span>{JSON.stringify(error.error)}</div>}
            </div>}
            {!loading && !error && (
                <Fragment>
                    <pre id='out-pre' style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        margin: '6rem 1rem',
                        fontSize: '0.6rem'
                    }}>
                        {isOut ?
                            [...stdout].reverse().map(txt => (
                                <div key={txt.id}>{txt.msg}</div>
                            )) :
                            stderr.map(txt => (
                                <div key={txt.id}>{txt.msg}</div>
                            ))
                        }
                    </pre>
                    <div ref={endRef} aria-hidden />
                </Fragment>
            )}
        </Fragment>
    );
}


const useServerLogsSocket = (setStdout, setStderr) => {
    const loginState = useSelector(state => state.auth);
    useEffect(() => {
        if (!loginState.isAdmin) return;
        const newSocket = io(SERVER_LINK, { query: { id: v4() } });
        newSocket.on('logger-new-log', msg => {
            setStdout(prev => [...prev, { msg, id: v4() }])
        });
        newSocket.on('logger-new-error', msg => {
            setStderr(prev => [...prev, { msg, id: v4() }])
        });
        return () => newSocket.close();
    }, [loginState.username, loginState.isAdmin, setStdout, setStderr]);
}

const useFetchServerLogs = (setLoading, setError, setStderr, setStdout, pageNo) => {
    useEffect(() => {
        setLoading(true);
        setError(undefined);
        fetch(
            `${SERVER_LINK}/api/experimental/logs?pageNo=${pageNo}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET',
                credentials: 'include'
            }
        )
            .then(async response => {
                if (response.ok) return response.json();
                const json = await response.json();
                return await Promise.reject(json);
            })
            .then(res => {
                setStdout(res.stdoutTxt.trim().split('\n').map(txt => ({ msg: txt, id: v4() })));
                setStderr(res.stderrTxt.trim().split('\n').map(txt => ({ msg: txt, id: v4() })));
            })
            .catch(setError)
            .finally(() => setLoading(false))
    }, [setLoading, setError, setStderr, setStdout, pageNo]);
}

const useColorTokens = dependency => {
    useEffect(() => {
        // setting timeout so that this process don't block rendering
        const timeoutId = setTimeout(() => {
            const outPre = document.getElementById('out-pre');
            if (!outPre) return;
            // tokens: [searchKey, className, regexFlags]
            [...outPre.childNodes].every(child => {
                if (child.getAttribute("tokenized") === "ok") return false;
                child.innerHTML = tokenize(child.innerHTML);
                child.setAttribute("tokenized", "ok");
                return true;
            });
        }, 10);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependency);
}

// searchKey, className, regexFlags
const tokens = [
    ['GET', 'get', 'g'],
    ['POST', 'post', 'g'],
    ['PUT', 'put', 'g'],
    ['DELETE', 'delete', 'g'],
    ['Unlinked', 'unlinked', 'g'],
    ['PORT', 'port', 'g'],
    ['Database', 'database', 'g'],
    ['Production', 'production', 'g'],
    ['Note:', 'note', 'g'],
    ['Add Note', 'addnote', 'g'],
    ['Edit Note', 'editnote', 'g'],
    ['Delete Note', 'deletenote', 'g'],
    ['Containers', 'containers', 'g'],
    ['Deleted', 'deleted', 'g'],
    ['Error', 'error', 'g'],
    ['failed', 'failed', 'g'],
    ['LOG', 'log', 'g'],
];

const tokenize = text => {
    tokens.forEach(tokenDetail => (
        text = text.replace(new RegExp(tokenDetail[0], tokenDetail[2]), `<span class='token token-${tokenDetail[1]}'>${tokenDetail[0]}</span>`)
    ));
    const timeVar = text.match('[0-9]+/[0-9]+/[0-9]+, [0-9]+:[0-9]+:[0-9]+ [a-zA-Z][a-zA-Z]');
    timeVar && (text = text.replace(timeVar[0], `<span class='token-time'>${timeVar[0]}</span>`));
    return text;
}

const Tools = ({ setIsOut, isOut, endRef, setPageNo, pageNo }) => {
    return (
        <Fragment>
            <Button
                variant='contained'
                color='success'
                onClick={() => setIsOut(prev => !prev)}
                sx={{ position: 'fixed', top: '5em', right: '1em', textTransform: 'capitalize', opacity: '0.9' }}
                startIcon={<Visibility />}
            >
                {isOut ? 'show stderr' : 'show stdout'}
            </Button>
            <Box sx={{ position: 'fixed', display: 'flex', top: '8em', right: '1em', opacity: '0.9' }} >
                <Fab onClick={() => setPageNo(prev => (prev === 1 ? 1 : prev - 1))} size="small" color="primary" aria-label="add">
                    <KeyboardDoubleArrowLeft />
                </Fab>
                <Paper elevation={3} sx={{ width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2em', margin: '0 0.2em' }} >{pageNo}</Paper>
                <Fab onClick={() => setPageNo(prev => prev + 1)} size="small" color="primary" aria-label="add">
                    <KeyboardDoubleArrowRight />
                </Fab>
            </Box>
            <Fab onClick={() => {
                endRef.current && endRef.current.scrollIntoView();
            }} style={{
                position: 'fixed', bottom: '4.5em', right: '1em', opacity: '0.9'
            }} size="small" color="primary" aria-label="add">
                <KeyboardArrowDown />
            </Fab>
        </Fragment>
    );
}

export default ServerLogs;
