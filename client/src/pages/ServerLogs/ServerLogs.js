import React, { useState, useEffect, Fragment, useRef } from 'react'
import { SERVER_LINK } from '../../dev-server-link';
import { v4 } from 'uuid';
import './ServerLogs.css';
import { Button, Fab } from '@mui/material';
import { KeyboardArrowDown, Visibility } from '@mui/icons-material';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

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

const ServerLogs = () => {

    const loginState = useSelector(state => state.auth);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [stdout, setStdout] = useState({});
    const [stderr, setStderr] = useState({});
    const [reColorToken, setReColorToken] = useState(false);
    const [isOut, setIsOut] = useState(true);
    const endRef = useRef(null);

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
    }, [loginState.username, loginState.isAdmin]);

    useFetchServerLogs(setLoading, setError, setStderr, setStdout, setReColorToken);

    useColorTokens([reColorToken, isOut, stderr, stdout]);

    if (loading) return (<div>Loading...</div>);
    else if (error) return (<div>{JSON.stringify(error)}</div>);
    else return (
        <Fragment>
            <Fab onClick={() => endRef.current.scrollIntoView()} style={{
                position: 'fixed', bottom: '4.5em', right: '1em', opacity: '0.9'
            }} size="small" color="primary" aria-label="add">
                <KeyboardArrowDown />
            </Fab>
            <Button
                variant='contained'
                color='success'
                onClick={() => setIsOut(prev => !prev)}
                sx={{ textTransform: 'capitalize' }}
                startIcon={<Visibility />}
            >
                {isOut ? 'show stderr' : 'show stdout'}
            </Button>
            <pre id='out-pre' style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                margin: '1rem',
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
    );
}

const useFetchServerLogs = (setLoading, setError, setStderr, setStdout, setReColorToken) => {
    useEffect(() => {
        setLoading(true);
        setError(undefined);
        fetch(
            `${SERVER_LINK}/api/experimental/logs`,
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
                setReColorToken(prev => !prev);
            })
            .catch(setError)
            .finally(() => setLoading(false))
    }, [setLoading, setError, setStderr, setStdout, setReColorToken]);
}

const useColorTokens = dependency => {
    useEffect(() => {
        // setting timeout so that this process don't block rendering
        const timeoutId = setTimeout(() => {
            const outPre = document.getElementById('out-pre');
            if (!outPre) return;
            // tokens: [searchKey, className, regexFlags]
            outPre.childNodes.forEach(ele => {
                if (ele.getAttribute("tokenized") === "ok") return;
                ele.innerHTML = tokenize(ele.innerHTML);
                ele.setAttribute("tokenized", "ok");
            });
        }, 10);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependency);
}

const tokenize = innerHTML => {
    tokens.forEach(tokenDetail => (
        innerHTML = innerHTML.replace(new RegExp(tokenDetail[0], tokenDetail[2]), `<span class='token token-${tokenDetail[1]}'>${tokenDetail[0]}</span>`)
    ));
    const timeVar = innerHTML.match('[0-9]+/[0-9]+/[0-9]+, [0-9]+:[0-9]+:[0-9]+ [a-zA-Z][a-zA-Z]');
    timeVar && (innerHTML = innerHTML.replace(timeVar[0], `<span class='token-time'>${timeVar[0]}</span>`));
    return innerHTML;
}

export default ServerLogs;
