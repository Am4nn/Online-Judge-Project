import React, { Fragment, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import classes from './Question.module.css';
import useFetch from '../../hooks/useFetch';
import CodeEditorv3 from './Editor/CodeEditorv3';
import ButtonCustom from '../../compenents/Button/Button';
import useLocalStorage from '../../hooks/useLocalStorage';
import LoadingSpinner from '../../compenents/LoadingSpinner/LoadingSpinner';

import SendIcon from '@mui/icons-material/Send';
import Settings from '@mui/icons-material/Settings'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import {
    Fab,
    Select,
    Drawer,
    Button,
    MenuItem,
    TextField,
    InputLabel,
    FormControl
} from '@mui/material';

import { SERVER_LINK } from '../../dev-server-link';
import { defaultCppCode, defaultPythonCode } from './defaultCodes/defaultCodes';

const Question = () => {
    const { id } = useParams();

    const navigator = useNavigate();
    const backBtnHandler = () => navigator(-1);

    const { loading, error, value: question } = useFetch(
        `${SERVER_LINK}/api/explore/problems/${id}`,
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET',
        },
        [id]
    )

    // not-initialized, submitting, response-ok, response-not-ok, error
    // not-initialized, submitting, submitted
    const [codeSubmittingState, setcodeSubmittingState] = useState('not-initialized');

    const [code, setCode] = useState(() => defaultCppCode);
    const [codeFontSize, setcodeFontSize] = useState(15);
    const [selectedLang, setSelectedLang] = useLocalStorage('selectedlangoj', 'cpp');
    const [drawerOpen, toggleDrawerOpen] = useState(false);
    const [response, setResponse] = useState([]);

    const endRef = useRef(null);

    const submitHandler = async event => {
        event.preventDefault();

        if (codeSubmittingState === 'submitting') return;

        console.log('submitting code');
        setcodeSubmittingState('submitting');

        try {
            const query = await fetch(
                `${SERVER_LINK}/api/explore/problems/${id}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({ code, language: selectedLang, testcase: question.testcase, quesName: question.name })
                }
            );
            const queryData = await query.json();
            setResponse(queryData);

            if (query.ok) {
                // console.info("response-ok", queryData);
                const intervalID = setInterval(async () => {
                    const response = await fetch(
                        `${SERVER_LINK}/api/explore/status/${queryData.queryId}`,
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: 'GET'
                        }
                    );
                    const data = await response.json();
                    if (!response.ok) {
                        clearInterval(intervalID);
                        setcodeSubmittingState('submitted');
                        setResponse(data);
                        // console.log("response-not-ok ", data);
                    }
                    else if (data.status !== 'pending') {
                        clearInterval(intervalID);
                        setcodeSubmittingState('submitted');
                        setResponse({ ...data.output, status: data.status });
                        // console.log(`status -> ${data.status}`, data);
                    }
                    // else console.log('status -> pending', data);
                }, 1000);
            }
            else {
                // console.log('response not ok ', queryData);
                setcodeSubmittingState('submitted');
            }

            endRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (error) {
            setResponse({ msg: 'caught errors while sending code to server for getting verdict', serverError: JSON.stringify(error) });
            setcodeSubmittingState('submitted');
        }
    }

    const resetCode = () => {
        switch (selectedLang) {
            case 'cpp':
                setCode(defaultCppCode);
                break;
            case 'py':
                setCode(defaultPythonCode);
                break;
            // case 'js':
            //     setCode(defaultJsCode);
            //     break;
            // case 'java':
            //     setCode(defaultJavaCode);
            //     break;
            default:
        }
    }

    return (
        <Fragment>
            {loading && <LoadingSpinner />}
            {!loading && error && (<div>
                <div className='errorTemplate'>
                    <div><span>Msg : </span>Wasn't able to connect to server check if your are not offline or server might not be working !</div>
                    {error && <div><span>Error : </span>{JSON.stringify(error)}</div>}
                </div>
            </div>)}
            {!loading && !error && (
                <div className={classes.contain}>
                    <div className={classes.back}>
                        <div className={classes.codeSnippet}>
                            &#60; go back to questions /&#62;
                        </div>
                        <ButtonCustom to='/' onClick={backBtnHandler} color='yellow'>
                            <ArrowBackIcon style={{ marginRight: '0.3em', transform: 'translateX(-12px)', fontSize: '1.2em' }} />
                            Back
                        </ButtonCustom>
                    </div>
                    <div className={classes.head}>
                        <div style={{ display: 'inline-block' }}>
                            <div className={classes.heading}>{question.name}</div>
                            <div className={classes.extraContent}>
                                <div className={classes.level} diff-color={question.difficulty}>{question.difficulty}</div>
                                <div className={classes.succ}>{question.noOfSuccess === 0 ? 0 : ((question.noOfSuccess / question.noOfSubm * 100).toFixed(2))}%<span> Success</span></div>
                                <div className={classes.subm}>{question.noOfSubm} <span>Submissions</span></div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.notHead}>
                        <div className={classes.body}>
                            <div className={classes.desc}>
                                {question.description}
                            </div>
                        </div>
                        {question.examples.map((example, index) => (
                            <div key={index} className={classes.body}>
                                <div className={classes.example} exn={index + 1}>
                                    <div><span>Input : </span>{example.input}</div>
                                    <div><span>Output : </span>{example.output}</div>
                                    {example.explaination && <div><span>Explaination : </span>{example.explaination}</div>}
                                </div>
                            </div>
                        ))}
                        <div className={classes.editor}>
                            <div className={classes.codeSnippet}>
                                &#60; write your code here in <span style={{ color: 'red', textTransform: 'uppercase' }}>{selectedLang}</span> /&#62;
                            </div>


                            <Fab style={{
                                zIndex: '899',
                                position: 'absolute',
                                top: '-2rem',
                                right: '18%'
                            }} onClick={() => toggleDrawerOpen(prev => !prev)} color="secondary" aria-label="add">
                                <div className={classes.optionSnippet}
                                    style={{
                                        top: '-1.5rem',
                                        whiteSpace: 'nowrap',
                                        textTransform: 'lowercase'
                                    }}
                                >
                                    &#60; change lang, font size, ... /&#62;
                                </div>
                                <Settings />
                            </Fab>
                            <Drawer
                                anchor='right'
                                open={drawerOpen}
                                onClose={() => toggleDrawerOpen(prev => !prev)}
                            >
                                <div style={{ width: '15rem', margin: '1rem' }}>
                                    <h1 className={classes.optionHeading} >Options</h1>


                                    <div className={classes.fontSnippet}>
                                        &#60; Font Size /&#62;
                                    </div>
                                    <div className={classes.changeFont}>
                                        <TextField
                                            type={'number'}
                                            value={codeFontSize}
                                            onChange={e => { if (e.target.value > 50 || e.target.value < 2) return; setcodeFontSize(e.target.value); }}
                                            // variant="filled"
                                            style={{ width: '100%' }}
                                            variant='standard'
                                        />
                                    </div>

                                    <div className={classes.changeLang}>
                                        <FormControl>
                                            <InputLabel id="changeLang-select-label">Language</InputLabel>
                                            <Select
                                                labelId="changeLang-select-label"
                                                id="changeLang-select"
                                                value={selectedLang}
                                                label="Language"
                                                style={{ width: '8em', height: '2.8em' }}
                                                onChange={e => setSelectedLang(e.target.value)}
                                            >
                                                <MenuItem value={'cpp'}>CPP</MenuItem>
                                                <MenuItem value={'py'}>PYTHON</MenuItem>
                                                {/* <MenuItem value={'java'}>JAVA</MenuItem> */}
                                                {/* <MenuItem value={'js'}>JS</MenuItem> */}
                                            </Select>
                                        </FormControl>
                                    </div>

                                    <div className={classes.resetCode}>
                                        <Button color="error" onClick={resetCode} variant='contained' startIcon={
                                            <RestartAltIcon fontSize='large' style={{ marginRight: '0.5em', fontSize: '2em' }} />
                                        } style={{ textTransform: 'capitalize' }}>
                                            ResetCode
                                        </Button>
                                    </div>
                                </div>
                            </Drawer>

                            <div className={classes.editorText}>
                                <CodeEditorv3
                                    selectedLang={selectedLang}
                                    code={code}
                                    setCode={setCode}
                                    language={selectedLang}
                                    fontSize={codeFontSize}
                                />
                            </div>
                        </div>
                        <div className={classes.submitBtn}>
                            <div className={classes.codeSnippet}>
                                &#60;&#160;
                                {codeSubmittingState === 'submitting' ?
                                    'wait for response' : (codeSubmittingState === 'not-initialized' ?
                                        'click here to submit' : 'wanna submit again')}
                                &#160;/&#62;
                            </div>
                            <ButtonCustom to='/' onClick={submitHandler} color='green'>
                                {codeSubmittingState === 'submitting' ? 'Submitting' : 'Submit'}
                                {codeSubmittingState === 'submitting' ? <div className={classes.spin} /> : <SendIcon style={{ marginLeft: '0.6em', fontSize: '1.2em' }} />}
                            </ButtonCustom>
                        </div>
                        {codeSubmittingState !== 'not-initialized' && (
                            <div className={classes.body}>
                                <div style={{ "--col": (response.status === 'success' ? 127 : 0) }} className={classes.response}>
                                    {response.msg && <div><span>Msg : </span>{response.msg}</div>}
                                    {response.stdout && <div><span>STDOUT : </span>{response.stdout}</div>}
                                    {response.stderr && <div><span>STDERR : </span>{response.stderr}</div>}
                                    {response.error && <div><span>Error : </span>{JSON.stringify(response.error)}</div>}
                                    {response.serverError && <div><span>serverError : </span>{response.serverError.toString()}</div>}
                                    {response.status === 'pending' && <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <LoadingSpinner /> </div>}
                                </div>
                            </div>
                        )}
                    </div>
                    <div aria-hidden ref={endRef}></div>
                </div>
            )}
        </Fragment >
    )
}

export default Question;